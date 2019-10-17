$(function () {

    $("#jqGrid").jqGrid({
        url: '../balogpair/list',
        datatype: "json",
        colModel:
            [
                {
                    label: '对账操作批次号', name: 'recon_bat_id', width: 80, hidden: true,
                    cellattr: function (rowId, tv, rawObject, cm, rdata) {
                        return 'id=\'recon_bat_id' + rowId + "\'";
                    }
                },
                {
                    label: '对账批内顺序号', name: 'recon_bat_seq', width: 80, hidden: true,
                    cellattr: function (rowId, tv, rawObject, cm, rdata) {
                        return 'id=\'recon_bat_seq' + rowId + "\'";
                    }
                },
                {label: '对账日期', name: 'sched_date', width: 50},
                {label: '规则ID', name: 'rule_id', width: 50},
                {label: '规则名称', name: 'rule_name', width: 50},
                {label: '交易日期', name: 'txn_date', width: 50},
                {label: '金额', name: 'txn_amt', width: 80},
                {label: '摘要', name: 'remark', width: 80},
                {label: '对方户名', name: 'peer_name', width: 80},
                {label: '交易日期', name: 'bz_txn_date', width: 50},
                {label: '交易类型', name: 'tran_name', width: 50},
                {label: '金额', name: 'bz_txn_amt', width: 80},
                {label: '机构号', name: 'inst_id', width: 80},
                {label: '机构简称', name: 'inst_name', width: 80}
            ],
        viewrecords: true,
        height: 385,
        rowNum: 10,
        // rowList: [100],
        rownumbers: false,
        rownumWidth: 25,
        autowidth: true,
        multiselect: false,
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
        recordtext: "总记录数 {2}",
        gridComplete: function () {
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });

            //设置行背景色
            var pre = {};
            var colors = ['lightgray','white'];
            var ids = $("#jqGrid").getDataIDs();
            for(var i=0;i < ids.length;i++){
                var rowData = $("#jqGrid").getRowData(ids[i]);
                var reconBatId = rowData.recon_bat_id;
                var reconBatSeq = rowData.recon_bat_seq;

                var color;
                if(i==0){
                    //首行取默认数据
                    pre.reconBatId = reconBatId;
                    pre.reconBatSeq = reconBatSeq;
                    pre.colorIndex = 0;

                    color = colors[0];
                }else{

                    if(reconBatId == pre.reconBatId && reconBatSeq == pre.reconBatSeq){

                        color = colors[pre.colorIndex];
                    }else{

                        var colorIndex = pre.colorIndex == 0?1:0;
                        color = colors[colorIndex];

                        //缓存新的数据
                        pre.reconBatId = reconBatId;
                        pre.reconBatSeq = reconBatSeq;
                        pre.colorIndex = colorIndex;
                    }
                }

                $("#"+ids[i]+ " td").css("background-color",color);
            }
        }
    });
    $("#jqGrid").jqGrid('setGroupHeaders', {
        useColSpanStyle: false,
        groupHeaders: [
            {startColumnName: 'recon_bat_id', numberOfColumns: 5, titleText: ''},
            {startColumnName: 'txn_date', numberOfColumns: 4, titleText: '<b>银行账户</b>'},
            {startColumnName: 'bz_txn_date', numberOfColumns: 5, titleText: '<b>平台业务数据</b>'}
        ]
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null,
        balinfRules: {},
        balBankCode: {}
    },
    created: function () {
        var url ="../balinfrules/getRules";
        $.post(url,function (r) {//初始化规则下拉框
            if(r.code == 0){
                vm.balinfRules = r.codes.balinfRules;
            }else {
            }
        });
        var url2 = "../balbankbooklog/getCodeInfo";
        $.post(url2, function (r) {//初始化字典
            if (r.code == 0) {
                vm.balBankCode = r.codes.bankCode;
            }
        });
    },
    methods: {
        query: function () {
            var beginDate = $("#beginDate").val();
            if (beginDate.length <= 0) {
                alert("开始日期不能为空，请输入开始日期！");
                return;
            }
            var endDate = $("#endDate").val();
            if (endDate.length <= 0) {
                alert("结束日期不能为空，请输入结束日期！");
                return;
            }
            vm.reload();
        },
        downLoadFile: function () {
            var beginDate = $("#beginDate").val();
            if (beginDate.length <= 0) {
                alert("开始日期不能为空，请输入开始日期！");
                return;
            }
            var endDate = $("#endDate").val();
            if (endDate.length <= 0) {
                alert("结束日期不能为空，请输入结束日期！");
                return;
            }
            var postData = {
                'beginDate': $("#beginDate").val(),
                'endDate': $("#endDate").val(),
                'ruleId': $("#ruleId").val(),
                'bankId': $("#bankId").val(),
                'instId': $("#instId").val()
            };
            exportExcelByWhere("../balogpair/export2Excel", postData);
        },
        reload: function (event) {
            vm.showList = true;
            //var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            var page = 1;
            var postData = {
                'beginDate': $("#beginDate").val(),
                'endDate': $("#endDate").val(),
                'ruleId': $("#ruleId").val(),
                'bankId': $("#bankId").val(),
                'instId': $("#instId").val()
            };
            $("#jqGrid").jqGrid('setGridParam', {
                postData: postData,
                page: page
            }).trigger("reloadGrid");
        }
    }
});

layui.use('laydate', function () {
    var laydate = layui.laydate;

    //执行一个laydate实例
    laydate.render({
        elem: "#beginDate",
        format: "yyyyMMdd"
    });
    laydate.render({
        elem: "#endDate",
        format: "yyyyMMdd"
    });
});

var rowType = 1;

function getColor() {
    var color = "";
    if (rowType % 2 == 0)
        color = "rgba(112,128,144,0.2)";
    else
        color = "rgba(255,255,250,0.3)";
    return color;
}

function setRowStyle(rowColor) {
    var ids = $("#jqGrid").getDataIDs();
    var length = ids.length;
    for (var i = 0; i < length; i++) {
        $("#jqGrid #" + ids[i]).find("td").css("background-color", rowColor[i]);
    }
    rowType = 1;
}

function MergerAndStyle(gridName, CellName) {
    var mya = $("#" + gridName + "").getDataIDs();
    var length = mya.length;
    var rowColor = new Array(length);
    for (var i = 0; i < length; i++) {
        var before = $("#" + gridName + "").jqGrid('getRowData', mya[i]);
        var rowSpanTaxCount = 1;
        if (rowColor[i] == undefined) {
            rowType++;
            rowColor[i] = getColor();
        }
        for (j = i + 1; j <= length; j++) {
            var end = $("#" + gridName + "").jqGrid('getRowData', mya[j]);
            var fields = CellName.split(",");
            if (isEquals(before, end, fields)) {
                rowSpanTaxCount++;
                setFieldsDisplayNone(gridName, fields, mya[j]);
                rowColor[j] = getColor();
            } else {
                rowSpanTaxCount = 1;
                break;
            }
            setRowSpan(fields, mya[i], rowSpanTaxCount);
        }
    }
    setRowStyle(rowColor);
}

function Merger(gridName, CellName) {
    var mya = $("#" + gridName + "").getDataIDs();
    var length = mya.length;
    for (var i = 0; i < length; i++) {
        var before = $("#" + gridName + "").jqGrid('getRowData', mya[i]);
        var rowSpanTaxCount = 1;
        for (j = i + 1; j <= length; j++) {
            var end = $("#" + gridName + "").jqGrid('getRowData', mya[j]);
            if (CellName.indexOf(",") > 0) {
                var fields = CellName.split(",");
                if (isEquals(before, end, fields)) {
                    rowSpanTaxCount++;
                    setFieldsDisplayNone(gridName, fields, mya[j]);
                } else {
                    rowSpanTaxCount = 1;
                    break;
                }
                setRowSpan(fields, mya[i], rowSpanTaxCount);
            } else {
                if (before[CellName] == end[CellName]) {
                    rowSpanTaxCount++;
                    $("#" + gridName + "").setCell(mya[j], CellName, '', {display: 'none'});
                } else {
                    rowSpanTaxCount = 1;
                    break;
                }
                $("#" + CellName + "" + mya[i] + "").attr("rowspan", rowSpanTaxCount);
            }
        }
    }
}

function isEquals(before, end, fields) {
    var isTrue = true;
    for (var i = 0; i < fields.length && isTrue; i++) {
        isTrue = before[fields[i]] == end[fields[i]];
    }
    return isTrue;
}

function setFieldsDisplayNone(gridName, fields, mya) {
    for (var i = 0; i < fields.length; i++) {
        $("#" + gridName + "").setCell(mya, fields[i], '', {display: 'none'});
    }
}

function setRowSpan(fields, mya, rowSpanTaxCount) {
    for (var i = 0; i < fields.length; i++) {
        $("#" + fields[i] + "" + mya + "").attr("rowspan", rowSpanTaxCount);
    }
}

function getRowSpan(fields, mya) {
    var rows = $("#" + fields + "" + mya + "").attr("rowspan");
}
