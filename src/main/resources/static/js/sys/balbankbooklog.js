$(function () {
    $("#jqGrid").jqGrid({
        url: '../balbankbooklog/list',
        datatype: "json",
        colModel: [
            {label: '导入的批次号', name: 'impBatId', index: 'imp_bat_id', width: 80},
            {label: '导入的批内顺序号', name: 'impBatSeq', index: 'imp_bat_seq', width: 80},
            {label: '账户开户行代码', name: 'bankId', index: 'bank_id', width: 80},
            {label: '开户账号', name: 'acctNo', index: 'acct_no', width: 80},
            {label: '交易日期', name: 'txnDate', index: 'txn_date', width: 80},
            {label: '日内顺序号', name: 'seqInDate', index: 'seq_in_date', width: 80},
            {label: '交易时间', name: 'txnTime', index: 'txn_time', width: 80},
            {label: '借贷记标志', name: 'dbocr', index: 'dbocr', width: 80},
            {label: '交易金额', name: 'txnAmt', index: 'txn_amt', width: 80},
            {label: '交易后余额', name: 'postBalance', index: 'post_balance', width: 80},
            {label: 'traceNo', name: 'traceNo', index: 'trace_no', width: 50, key: true},
            {label: '摘要', name: 'remark', index: 'remark', width: 80},
            {label: '用途', name: 'intent', index: 'intent', width: 80},
            {label: '对方账户', name: 'peerAcct', index: 'peer_acct', width: 80},
            {label: '对方账户名称', name: 'peerName', index: 'peer_name', width: 80},
            {label: '对方开户行', name: 'peerBank', index: 'peer_bank', width: 80},
            {label: '凭证号', name: 'voucher', index: 'voucher', width: 80},
            {label: '单位结算卡号', name: 'compan', index: 'compan', width: 80},
            {label: '对账操作批次号', name: 'reconBatId', index: 'recon_bat_id', width: 80},
            {label: '对账批内顺序号', name: 'reconBatSeq', index: 'recon_bat_seq', width: 80},
            {label: '匹配规则ID', name: 'ruleId', index: 'rule_id', width: 80},
            {label: '上次运行的批次号', name: 'lastBatId', index: 'last_bat_id', width: 80},
            {label: '上次匹配的批内顺序号', name: 'lastBatSeq', index: 'last_bat_seq', width: 80},
            {label: '上次匹配的规则ID', name: 'lastRuleId', index: 'last_rule_id', width: 80},
            {label: '记录更新日期', name: 'tsLastUpdate', index: 'ts_last_update', width: 80}
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
            bankId: ""
        },
        showList: true,
        title: null,
        balBankbookLog: {},
        balBankCode: {}
    },
    created: function () {
        var url = "../balbankbooklog/getCodeInfo";
        $.post(url, function (r) {//初始化字典
            if (r.code == 0) {
                vm.balBankCode = r.codes.bankCode;
            } else {
            }
        });
    },
    methods: {
        bookRecon: function () {
            var url = "../balbankbooklog/bookRecon";
            $.ajax({
                type: "POST",
                data: JSON.stringify({'natureDt': $("#natureDt").val()}),
                url: url,
                success: function (r) {
                    if (r.code == 0) {
                        alert(r.msg);
                    } else {
                        alert(r.msg);
                    }
                    vm.reload();
                }
            });

        },
        query: function () {
            vm.reload();
        },
        add: function () {
            vm.showList = false;
            vm.title = "新增";
            vm.balBankbookLog = {};
        },
        reset: function () {
            $("#txnDateStart").val("");
            $("#txnDateEnd").val("");
        },
        update: function (event) {
            var traceNo = getSelectedRow();
            if (traceNo == null) {
                return;
            }
            vm.showList = false;
            vm.title = "修改";

            vm.getInfo(traceNo)
        },
        saveOrUpdate: function (event) {
            var url = vm.balBankbookLog.traceNo == null ? "../balbankbooklog/save" : "../balbankbooklog/update";
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(vm.balBankbookLog),
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
            var traceNos = getSelectedRows();
            if (traceNos == null) {
                return;
            }

            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: "../balbankbooklog/delete",
                    data: JSON.stringify(traceNos),
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
        getInfo: function (traceNo) {
            $.get("../balbankbooklog/info/" + traceNo, function (r) {
                if (r.code == 0) {
                    vm.balBankbookLog = r.balBankbookLog;
                } else {
                    alert(r.msg);
                }
            });
        },
        reload: function (event) {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            $("#jqGrid").jqGrid('setGridParam', {
                postData: {
                    'bankId': vm.q.bankId,
                    'txnDateStart': $("#txnDateStart").val(),
                    'txnDateEnd': $("#txnDateEnd").val(),
                    "txnAmt": $("#txnAmt").val()
                },
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
//////////////////////////手动新增区域//////////////////////////////////////
layui.use('laydate', function () {
    var laydate = layui.laydate;

    //执行一个laydate实例
    laydate.render({
        elem: '#jyrq', //指定元素
    });
    laydate.render({
        elem: '#gxrq', //指定元素
        type: 'time' //指定元素
    });
    laydate.render({
        elem: '#jysj', //指定元素
        type: 'datetime'
    });
    laydate.render({
        elem: "#natureDt",
        format: "yyyyMMdd"
    });
    laydate.render({
        elem: "#txnDateStart",
        format: "yyyyMMdd"
    });
    laydate.render({
        elem: "#txnDateEnd",
        format: "yyyyMMdd"
    });
});

/////////////文件导入///////////////
$('#upLoadPayerCreditInfoExcel').click(function () {
    if (checkData()) {
        var formData = new FormData();
        formData.append("upfile", document.getElementById("upfile").files[0]);
        $.ajax({
            url: "../balbankbooklog/readExcel",
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
        alert("选择需要导入的Excel文件！");
        return false;
    }
    if (".xls" != suffix && ".xlsx" != suffix) {
        alert("选择Excel格式的文件导入！");
        return false;
    }
    return true;
}