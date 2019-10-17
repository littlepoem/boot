$(function () {
    $("#jqGrid").jqGrid({
        url: '../balreconassolog/list',
        datatype: "json",
        colModel: [
            {label: '导入的批次号', name: 'impBatId', index: 'imp_bat_id', width: 80},
            {label: '导入的批内顺序号', name: 'impBatSeq', index: 'imp_bat_seq', width: 80},
            {label: '交易日期', name: 'txnDate', index: 'txn_date', width: 80},
            {label: '交易时间', name: 'txnTime', index: 'txn_time', width: 80},
            {label: '清算日期', name: 'settleDt', index: 'settle_dt', width: 80},
            {label: '业务码', name: 'bizCode', index: 'biz_code', width: 80},
            {label: '单位协议号', name: 'deptProtNo', index: 'dept_prot_no', width: 80},
            {label: '文件名', name: 'fileName', index: 'file_name', width: 80},
            {label: '银行账号', name: 'bankAccoutNo', index: 'bank_accout_no', width: 80},
            {label: '银行交易流水', name: 'bankTxnSerial', index: 'bank_txn_serial', width: 50, key: true},
            {label: '金额', name: 'amt', index: 'amt', width: 80},
            {label: '记账日期', name: 'chargeDate', index: 'charge_date', width: 80},
            {label: '记账流水号', name: 'chargeSerialNo', index: 'charge_serial_no', width: 80},
            {label: '请求方交易日期', name: 'requesterTxnDate', index: 'requester_txn_date', width: 80},
            {label: '请求方交易流水号', name: 'requesterTxnSerialNo', index: 'requester_txn_serial_no', width: 80},
            {label: '商户号', name: 'merId', index: 'mer_id', width: 80},
            {label: '业务标识码', name: 'bizIdentifier', index: 'biz_identifier', width: 80},
            {label: '手续费', name: 'chargeFee', index: 'charge_fee', width: 80},
            {label: '财务状态', name: 'finStatus', index: 'fin_status', width: 80},
            {label: '交易状态', name: 'txnStatus', index: 'txn_status', width: 80},
            {label: '交易描述', name: 'txnDescri', index: 'txn_descri', width: 80},
            {label: '备注', name: 'remark', index: 'remark', width: 80},
            {label: '汇总请款流水号', name: 'sumReqFundSerialNo', index: 'sum_req_fund_serial_no', width: 80}
        ],
        viewrecords: true,
        height: 385,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader: {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames: {
            page: "page",
            rows: "limit",
            order: "order"
        },
        gridComplete: function () {
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        q: {
            txnDate: null,
            merId: null,
            requesterTxnSerialNo:null,
            sumReqFundSerialNo:null,
            bankTxnSerial:null,
            chargeSerialNo:null,
            codeMap: {}

        },
        showList: true,
        title: null,
        balReconAssoLog: {}
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reset: function () {
            $("#txnDateQueryId").val("");
            vm.q.txnDate = null;
            vm.q.merId = null;
            vm.q.requesterTxnSerialNo = null;
            vm.q.sumReqFundSerialNo = null;
            vm.q.bankTxnSerial = null;
            vm.q.chargeSerialNo = null;
        },
        add: function () {
            vm.showList = false;
            vm.title = "新增";
            vm.balReconAssoLog = {};
        },
        update: function (event) {
            var bankTxnSerial = getSelectedRow();
            if (bankTxnSerial == null) {
                return;
            }
            vm.showList = false;
            vm.title = "修改";

            vm.getInfo(bankTxnSerial)
        },
        saveOrUpdate: function (event) {
            var url = vm.balReconAssoLog.bankTxnSerial == null ? "../balreconassolog/save" : "../balreconassolog/update";
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(vm.balReconAssoLog),
                success: function (r) {
                    if (r.code === 0) {
                        alert(r, function (index) {
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        del: function (event) {
            var bankTxnSerials = getSelectedRows();
            if (bankTxnSerials == null) {
                return;
            }

            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: "../balreconassolog/delete",
                    data: JSON.stringify(bankTxnSerials),
                    success: function (r) {
                        if (r.code == 0) {
                            alert(r, function (index) {
                                $("#jqGrid").trigger("reloadGrid");
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        getInfo: function (bankTxnSerial) {
            $.get("../balreconassolog/info/" + bankTxnSerial, function (r) {
                if (r.code == 0) {
                    vm.balReconAssoLog = r.balReconAssoLog;
                } else {
                    alert(r.msg);
                }
            });
        },
        reload: function (event) {
            vm.showList = true;
            var page = 1;
            var txnDate = $("#txnDateQueryId").val();
            $("#jqGrid").jqGrid('setGridParam', {
                postData: {'txnDate': txnDate, 'merId': vm.q.merId, 'requesterTxnSerialNo': vm.q.requesterTxnSerialNo, 'sumReqFundSerialNo': vm.q.sumReqFundSerialNo, 'bankTxnSerial': vm.q.bankTxnSerial, 'chargeSerialNo': vm.q.chargeSerialNo},
                page: page
            }).trigger("reloadGrid");
        },
        choseColumns: function (event) {
            var p = $(event.target).position();
            $("#jqGrid").jqGrid('choseColumns', {
                modal: true,
                top: p.top,
                left: p.left,
                dataheight: '450px'
            });
        }
    }
});

/////////////文件导入///////////////
$('#upLoadPayerCreditInfoExcel').click(function () {
    if (checkData()) {
        var formData = new FormData();
        formData.append("upfile", document.getElementById("upfile").files[0]);
        $.ajax({
            url: "../balreconassolog/readExcel",
            type: "post",
            data: formData,
            contentType: false,
            processData: false,

            success: function (data) {
                alert(data.status);
                vm.reload();
            },
        });
    }
});

//JS校验form表单信息
function checkData() {
    var fileDir = $("#upfile").val();
    var suffix = fileDir.substr(fileDir.lastIndexOf("."));
    if ("" == fileDir) {
        alert("选择需要导入的文件！");
        return false;
    }
    if (".txt" != suffix && ".txt" != suffix) {
        alert("选择txt格式的文件导入！");
        return false;
    }
    return true;
}


layui.use('laydate', function () {
    var laydate = layui.laydate;
    laydate.render({
        elem: "#txnDateQueryId",
        format: "yyyyMMdd"
    });
});