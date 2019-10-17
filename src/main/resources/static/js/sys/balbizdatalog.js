$(function () {
    $("#jqGrid").jqGrid({
        url: '../balbizdatalog/list',
        datatype: "json",
        colModel: [
            {label: '导入的批次号', name: 'impBatId', index: 'imp_bat_id', width: 180},
            {label: '导入的批内顺序号', name: 'impBatSeq', index: 'imp_bat_seq', width: 80},
            {label: '平台代码', name: 'platId', index: 'plat_id', width: 100},
            {label: '交易代码', name: 'tranId', index: 'tran_id', width: 150, hidden: true},
            {label: '子交易代码', name: 'subTranId', index: 'sub_tran_id', width: 150, hidden: true},
            {label: '交易名称', name: 'tranName', index: 'tran_id', width: 150},
            {label: '子交易名称', name: 'subTranName', index: 'sub_tran_id', width: 150},
            {label: '记录来源', name: 'sources', index: 'sources', width: 100, formatter: sourcesFormatter},
            {label: '机构号', name: 'instId', index: 'inst_id', width: 120},
            {label: '机构名称', name: 'instName', index: 'inst_name', width: 120},
            {label: '交易日期', name: 'txnDate', index: 'txn_date', width: 120},
            {label: '交易时间', name: 'txnTime', index: 'txn_time', width: 100},
            {label: '交易键值', name: 'traceNo', index: 'trace_no', width: 180, key: true},
            {label: '交易笔数', name: 'txnNum', index: 'txn_num', width: 180},
            {label: '交易金额', name: 'txnAmt', index: 'txn_amt', width: 180},
            {label: '借贷记标志', name: 'dbocr', index: 'dbocr', width: 80},
            {label: '交易结果', name: 'respCode', index: 'dbocr', width: 80},
            {label: '记录来源说明', name: 'remark', index: 'remark', width: 120},
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
            platId: null,
            tranId: null,
            instId: null,
            codeMap: {}

        },
        showList: true,
        title: null,
        balBizdataLog: {},
        platIdCode: {},
        tranIdCode: {}
    },
    created: function () {
        var url = "../balbizdatalog/getCodeMap";
        $.post(url, function (r) {//初始化字典
            if (r.code == 0) {
                vm.codeMap = r.codes.codeMapp;
                vm.platIdCode = r.codes.platIdCode;
                vm.tranIdCode = r.codes.tranIdCode;
            } else {
            }
        });

    },
    methods: {
        query: function () {
            vm.reload();
        },
        add: function () {
            vm.showList = false;
            vm.title = "新增";
            vm.balBizdataLog = {};
        },
        reset: function () {
            $("#txnDateStart").val("");
            $("#txnDateEnd").val("");
            $("#platId").val("");
            vm.q.instId = "";
            vm.q.tranId = "";

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
            var url = vm.balBizdataLog.traceNo == null ? "../balbizdatalog/save" : "../balbizdatalog/update";
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(vm.balBizdataLog),
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
                    url: "../balbizdatalog/delete",
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
            $.get("../balbizdatalog/info/" + traceNo, function (r) {
                if (r.code == 0) {
                    vm.balBizdataLog = r.balBizdataLog;
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
                    'platId': $("#platId").val(),
                    'tranId': vm.q.tranId,
                    'instId': vm.q.instId,
                    'txnDateStart': $("#txnDateStart").val(),
                    'txnDateEnd': $("#txnDateEnd").val(),
                    'txnAmt': $("#txnAmt").val()
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

/////////////文件导入///////////////
$('#upLoadUnionPayInfoTxt').click(function () {
    if (checkData()) {
        var formData = new FormData();
        formData.append("upfile", document.getElementById("upfile").files[0]);
        $.ajax({
            url: "../balbizdatalog/readExcel",
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

$('#upLoadPlatFormInfoTxt').click(function () {
    if (checkData2()) {
        var formData = new FormData();
        formData.append("upfile", document.getElementById("upfile2").files[0]);
        $.ajax({
            url: "../balbizdatalog/readPlatformInfo",
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
    return true;
}

//JS校验form表单信息
function checkData2() {
    var fileDir = $("#upfile2").val();
    var suffix = fileDir.substr(fileDir.lastIndexOf("."));
    if ("" == fileDir) {
        alert("选择需要导入的文件！");
        return false;
    }
    if (".bizdata" != suffix) {
        alert("选择正确格式的文件导入！");
        return false;
    }
    return true;
}

//表格数据转码
function sourcesFormatter(value, options, row) {
    var html = '';
    if (value == 3) {
        html = '报表数据';
    } else if (value == 2) {
        html = '交易记录';
    } else if (value == 1) {
        html = '程序添加';
    } else if (value == 0) {
        html = '手工添加';
    }
    return html;
}

function tranIdFormatter(value, options, row) {
    var v = value;

    if (v != null && v != "") {
        var keyy = "bal_tranType_" + v;
        v = vm.codeMap[keyy];
    } else {
        v = "";
    }
    return v;
}


function subTranIdFormatter(value, options, row) {
    var tranId = row.tranId;
    var v = value;

    if (v != null && v != "") {
        var keyy = "bal_subtranType_" + tranId + "_" + v;
        v = vm.codeMap[keyy];
    } else {
        v = "";
    }
    return v;
}

layui.use('laydate', function () {
    var laydate = layui.laydate;
    laydate.render({
        elem: "#txnDateStart",
        format: "yyyyMMdd"
    });
    laydate.render({
        elem: "#txnDateEnd",
        format: "yyyyMMdd"
    });
});
