$(function () {
    $("#jqGrid").jqGrid({
        url: '../balbizbankmanuallog/verify',
        datatype: "json",
        colModel: [
            {label: '对账操作批次号', name: 'recon_bat_id', sortable: false, width: 40},
            {label: '对账批内顺序号', name: 'recon_bat_seq', sortable: false, width: 40},
            {label: '调度日期', name: 'sched_date', sortable: false, width: 40},
            {label: '录入用户', name: 'create_user_id', sortable: false, width: 40},
            {label: '录入时间', name: 'ts_create', sortable: false, width: 40},
            {label: '录入意见', name: 'create_opinion', sortable: false, width: 160}
        ],
        viewrecords: true,
        height: 485,
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: true,
        jsonReader: {
            root: "list"
        },
        shrikToFit: true,
        subGrid: true,
        subGridRowExpanded: function (subgrid_id, row_id) {
            var bizsubgrid = "biz" + subgrid_id + "_t";
            var banksubgrid = "bank" + subgrid_id + "_t";
            var rows = $("#jqGrid").jqGrid('getRowData', row_id);
            var subGridHtml = "<div style='width:100%;overflow:auto'>";
            subGridHtml += "<div style='width:50%;overflow:auto;float : left;'>";
            subGridHtml += "<table id='" + banksubgrid + "'></table></div>";
            subGridHtml += "<div style='width:50%;overflow:auto;float : right;'>";
            subGridHtml += "<table id='" + bizsubgrid + "'></table></div>";
            subGridHtml += "</div>";
            $("#" + subgrid_id).html(subGridHtml);
            $("#" + bizsubgrid).jqGrid({
                url: '../balbizbankmanuallog/queryBizLogBySeq',
                postData: {"batId": rows.recon_bat_id, "batSeq": rows.recon_bat_seq},
                datatype: "json",
                colModel: [
                    {label: '日期', name: 'recon_date', width: 80},
                    {label: '交易类型', name: 'tran_id', width: 80},
                    {label: '金额', name: 'txn_amt', width: 80},
                    {label: '机构号', name: 'inst_id', width: 80},
                    {label: '机构简称', name: 'inst_sname', width: 80}
                ],
                jsonReader: {
                    root: "list"
                },
                autowidth: true,
                height: "100%",
                gridComplete: function () {
                    $("#" + bizsubgrid).closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
                }
            });
            $("#" + banksubgrid).jqGrid({
                url: '../balbizbankmanuallog/queryBankLogBySeq',
                postData: {"batId": rows.recon_bat_id, "batSeq": rows.recon_bat_seq},
                datatype: "json",
                colModel: [
                    {label: '日期', name: 'recon_date', width: 80},
                    {label: '金额', name: 'txn_amt', width: 80},
                    {label: '摘要', name: 'remark', width: 80},
                    {label: '对方启名', name: 'peer_name', width: 80}
                ],
                jsonReader: {
                    root: "list"
                },
                autowidth: true,
                height: "100%",
                gridComplete: function () {
                    $("#" + banksubgrid).closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
                }
            });
        },
        gridComplete: function () {
            setRowsStyle();
            var timeOut = 50;
            var rowIds = $("#jqGrid").getDataIDs();
            $.each(rowIds, function (index, rowId) {
                setTimeout(function () {
                    $("#jqGrid").expandSubGridRow(rowId);
                }, timeOut);
                timeOut = timeOut + 200;
            });
        }
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null,
        balBizBankManualLog: {}
    },
    methods: {
        reload: function (event) {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            $("#jqGrid").jqGrid('setGridParam', {
                page: page
            }).trigger("reloadGrid");
        },
        verifyFunc: function () {
            var url = '../balbizbankmanuallog/verifyRecord';
            var ids = $("#jqGrid").getGridParam("selarrrow");
            var rows = [];
            for (var i = 0; i < ids.length; i++) {
                var rowData = $("#jqGrid").getRowData(ids[i]);
                rows.push(rowData);
            }
            if (rows.length <= 0) {
                alert("未选择待审批数据，请确认！");
                return;
            }
            var resData = {"resData": rows};
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(resData),
                success: function (r) {
                    alert(r.msg);
                    vm.reload();
                }
            });
        }
    }
});

function setRowsStyle() {
    var rowIds = $("#jqGrid").getDataIDs();
    $.each(rowIds, function (index, rowId) {
        $("#jqGrid #" + rowId).find("td").css("background-color", "rgba(43,234,140,0.2)");
    });
}