$(function () {

    var url = location.search; //获取url中"?"符后的字串 ('?modFlag=business&role=1')
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1); //substr()方法返回从参数值开始到结束的字符串；
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    var nowDate = "";
    if (url != "" && url != null) {
        $("#back").css('display', 'block');
        nowDate = theRequest.nowDate;
        $("#natureDt").val(nowDate);
    }

    var postData = {"recon_date": nowDate};
    $("#jqGrid").jqGrid({
        url: '../balbankbooklog/viewBalance',
        datatype: "json",
        postData: postData,
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
                {
                    label: '规则ID', name: 'rule_id', width: 40,
                    cellattr: function (rowId, tv, rawObject, cm, rdata) {
                        return 'id=\'rule_id' + rowId + "\'";
                    }
                },
                {
                    label: '规则名称', name: 'ruleName', width: 80,
                    cellattr: function (rowId, tv, rawObject, cm, rdata) {
                        return 'id=\'ruleName' + rowId + "\'";
                    }
                },
                {label: '对账日期', name: 'bank_recon_date', width: 50},
                {label: '交易日期', name: 'bank_txn_date', width: 50},
                {label: '金额', name: 'bank_txn_amt', width: 80},
                {label: '摘要', name: 'bank_remark', width: 80},
                {label: '对方户名', name: 'bank_peer_name', width: 80},
                {label: '对账日期', name: 'biz_recon_date', width: 50},
                {label: '交易日期', name: 'biz_txn_date', width: 50},
                {label: '交易类型', name: 'biz_tran_name', width: 50},
                {label: '金额', name: 'biz_txn_amt', width: 80},
                {label: '机构号', name: 'biz_inst_id', width: 80},
                {label: '机构简称', name: 'biz_inst_sname', width: 80},
            ],
        viewrecords: true,
        height: 385,
        rowNum: -1,
        // rowList: [100],
        rownumbers: false,
        rownumWidth: 25,
        // autowidth: true,
        // multiselect: false,
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
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
            // var gridName = "jqGrid";
            // MergerAndStyle(gridName, 'recon_bat_id,recon_bat_seq,rule_id,ruleName');
        }
    });
    $("#jqGrid").jqGrid('setGroupHeaders', {
        useColSpanStyle: false,
        groupHeaders: [
            {startColumnName: 'recon_bat_id', numberOfColumns: 3, titleText: ''},
            {startColumnName: 'bank_recon_date', numberOfColumns: 4, titleText: '<b>银行账户</b>'},
            {startColumnName: 'biz_recon_date', numberOfColumns: 5, titleText: '<b>平台业务数据</b>'}
        ]
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null,
        balMatchRulesInfoList: {},
        balBankCode: {}
    },
    created: function () {
        var url = "../balmatchrulesinfo/getMatchRulesInfo";
        $.post(url, function (r) {//初始化规则下拉框
            if (r.code == 0) {
                vm.balMatchRulesInfoList = r.rules;
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
            var natureDt = $("#natureDt").val();
            if (natureDt.length <= 0) {
                alert("对账日期不能为空，请输入对账日期！");
                return;
            }
            vm.reload();
        },
        downLoadFile: function () {
            var postData = {
                'recon_date': $("#natureDt").val(),
                'ruleId': $("#ruleId").val(),
                'bankId': $("#bankId").val(),
                'instId': $("#instId").val()
            };
            exportExcelByWhere("../balbankbooklog/viewBalance2Excel", postData);
        },
        back: function (event) {
            history.go(-1);
        },
        reload: function (event) {
            vm.showList = true;
            // var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            var page = 1;
            var postData = {
                'recon_date': $("#natureDt").val(),
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
        elem: "#natureDt",
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
