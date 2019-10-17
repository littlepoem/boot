$(function () {
    var nowDate = new DateFormate(new Date(),"yyyyMMdd").formatdate();
    var preDate = new DateFormate(new Date(),"yyyyMMdd").getPreDate();
    $("#jqGrid").jqGrid({
        url: '../balMain/batchRsltlist',
        datatype: "json",
        postData: {"key": nowDate},
        colModel: [			
			{ label: '操作类型', name: 'importTypeDesc', width: 50 },
            { label: '操作类型', name: 'importType', width: 50,hidden:true },
			{ label: '操作记录数', name: 'totalCount', width: 70,formatter:totalCountFormatter}
        ],
		viewrecords: true,
        height: 150,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: false,
        pager: "#jqGridPager",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
        	//隐藏grid底部滚动条
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        }
    });

    $("#jqGrid2").jqGrid({
        url: '../balMain/bizDataChecklist',
        datatype: "json",
        postData: {"key": nowDate},
        colModel: [
            { label: '对账类型', name: 'actTypeDesc', width: 50 },
            { label: '对账类型', name: 'actType',hidden:true, width: 50 },
            { label: '对账总记录数', name: 'totalCount', width: 70,formatter:totalFormatter },
            { label: '平账', name: 'pz', width: 50,formatter:pzFormatter },
            { label: '账不平', name: 'zbp', width: 50,formatter:zbpFormatter }

        ],
        viewrecords: true,
        height: 150,
        rowNum: 10,
        rowList : [10,30,50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth:true,
        multiselect: false,
        pager: "#jqGridPager2",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page",
            rows:"limit",
            order: "order"
        },
        gridComplete:function(){
            //隐藏grid底部滚动条
            $("#jqGrid2").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });
        }
    });

    $("#jqGrid3").jqGrid({
        url: '../balbankbooklog/viewBalance',
        datatype: "json",
        postData: {"recon_date": nowDate},
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
                {label: '日期', name: 'bank_recon_date', width: 50},
                {label: '金额', name: 'bank_txn_amt', width: 80},
                {label: '摘要', name: 'bank_remark', width: 80},
                {label: '对方户名', name: 'bank_peer_name', width: 80},
                {label: '日期', name: 'biz_recon_date', width: 50},
                {label: '交易类型', name: 'biz_tran_name', width: 50},
                {label: '金额', name: 'biz_txn_amt', width: 80},
                {label: '机构号', name: 'biz_inst_id', width: 80},
                {label: '机构简称', name: 'biz_inst_sname', width: 80},
            ],
        viewrecords: true,
        height: 300,
        rowNum: -1,
        rowList: [100],
        rownumbers: false,
        rownumWidth: 25,
        autowidth: true,
        multiselect: false,
        pager: "#jqGridPager3",
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
            $("#jqGrid3").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
            var gridName = "jqGrid3";
            MergerAndStyle(gridName, 'recon_bat_id,recon_bat_seq,rule_id,ruleName');
        }
    });
    $("#jqGrid3").jqGrid('setGroupHeaders', {
        useColSpanStyle: false,
        groupHeaders: [
            {startColumnName: 'recon_bat_id', numberOfColumns: 3, titleText: ''},
            {startColumnName: 'bank_txn_date', numberOfColumns: 4, titleText: '<b>银行账户</b>'},
            {startColumnName: 'biz_txn_date', numberOfColumns: 5, titleText: '<b>平台业务数据</b>'}
        ]
    });

    $("#refreshBtnId").click(function(){
        vm.reload();
    });
});

var vm = new Vue({
	el:'#rrapp',
	data:{
		q:{
			key: null
		},
	},
	methods: {
        reload: function (event) {
            vm.showList = true;
            var page = 1;
            var nowDate = new DateFormate(new Date(),"yyyyMMdd").formatdate();
            var preDate = new DateFormate(new Date(),"yyyyMMdd").getPreDate();
            $("#jqGrid").jqGrid('setGridParam',{
                postData:{"key": nowDate},
                page:page
            }).trigger("reloadGrid");

            page = 1;
            $("#jqGrid2").jqGrid('setGridParam',{
                postData:{"key": nowDate},
                page:page
            }).trigger("reloadGrid");

            page = 1;
            $("#jqGrid3").jqGrid('setGridParam',{
                postData:{"txn_date": nowDate},
                page:page
            }).trigger("reloadGrid");
        },
        moreClick:function (event) {
            var url = "";
            var nowDate = new DateFormate(new Date(),"yyyyMMdd").formatdate();
            var preDate = new DateFormate(new Date(),"yyyyMMdd").getPreDate();
            if(event == "czjl"){
                url = "balbatchrslt.html?actionname=tmp&nowDate="+nowDate;
            }else if(event == "ptdz"){
                url = "balbizcheckrslt.html?actionname=tmp&nowDate="+nowDate;
            }else if(event == "zhdz"){
                url = "balbankbooklog_view.html?actionname=tmp&nowDate="+nowDate;
            }
            window.location.href = url;
        }
	}
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
    var ids = $("#jqGrid3").getDataIDs();
    var length = ids.length;
    for (var i = 0; i < length; i++) {
        $("#jqGrid3 #" + ids[i]).find("td").css("background-color", rowColor[i]);
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

//表格数据转码
function totalCountFormatter(value, options, row){
    var typeId = row.importType;
    var html = '';
    var nowDate = new DateFormate(new Date(),"yyyyMMdd").formatdate();
    var preDate = new DateFormate(new Date(),"yyyyMMdd").getPreDate();
    var url = "balbatchrslt.html?actionname="+value+"&typeId="+typeId+"&nowDate="+nowDate;
    html = "<a  href="+url+" class='listcount'>"+value+"</a>";
    return html;
}

//表格数据转码
function pzFormatter(value, options, row){
    var typeId = row.actType;
    var html = '';
    var nowDate = new DateFormate(new Date(),"yyyyMMdd").formatdate();
    var preDate = new DateFormate(new Date(),"yyyyMMdd").getPreDate();
    //var nowDate = "20180702";
    var url = "balbizcheckrslt.html?actionname="+value+"&typeId="+typeId+"&respCode=0"+"&nowDate="+nowDate;
    html = "<a  href="+url+" class='listcount'>"+value+"</a>";
    return html;
}

//表格数据转码
function zbpFormatter(value, options, row){
    var typeId = row.actType;
    var html = '';
    var nowDate = new DateFormate(new Date(),"yyyyMMdd").formatdate();
    //var nowDate = "20180702";
    var preDate = new DateFormate(new Date(),"yyyyMMdd").getPreDate();
    var url = "balbizcheckrslt.html?actionname="+value+"&typeId="+typeId+"&respCode=1"+"&nowDate="+nowDate;
    html = "<a  href="+url+" class='listcount'>"+value+"</a>";
    return html;
}

//表格数据转码
function totalFormatter(value, options, row){
    var typeId = row.actType;
    var html = '';
    var nowDate = new DateFormate(new Date(),"yyyyMMdd").formatdate();
    var preDate = new DateFormate(new Date(),"yyyyMMdd").getPreDate();
    //var nowDate = "20180702";
    var url = "balbizcheckrslt.html?actionname="+value+"&typeId="+typeId+"&nowDate="+nowDate;
    html = "<a  href="+url+" class='listcount'>"+value+"</a>";
    return html;
}

