$(function () {
    $("#jqGrid").jqGrid({
        url: '../balogmanupair/verifyList',
        datatype: "json",
        colModel: [
            {label: '操作批次号', name: 'recon_bat_id', sortable: false, width: 60},
            {label: '录入用户', name: 'creator', sortable: false, width: 40},
            {label: '录入时间', name: 'ts_create', sortable: false, width: 40},
            {
                label: '录入意见', index: 'remark', width: 50, align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    return "<span bind-data='"+rowObject.remark+"' class='remarkCl' style='display:block; width:100%; cursor:pointer;'>点击查看</span>";
                }
            }
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
                url: '../balogmanupair/queryBalogBizByBatId',
                postData: {"reconBatId": rows.recon_bat_id},
                datatype: "json",
                colModel: [
                    {label: '日期', name: 'recon_date', width: 60},
                    {label: '交易类型', name: 'tran_id', width: 80},
                    {label: '金额', name: 'txn_amt', width: 100},
                    {label: '借贷记标志', name: 'dbocr', width: 60},
                    {label: '机构号', name: 'inst_id', width: 80},
                    {label: '机构简称', name: 'inst_sname', width: 100}
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
                url: '../balogmanupair/queryBalogBankByBatId',
                postData: {"reconBatId": rows.recon_bat_id},
                datatype: "json",
                colModel: [
                    {label: '日期', name: 'recon_date', width: 60},
                    {label: '金额', name: 'txn_amt', width: 100},
                    {label: '借贷记标志', name: 'dbocr', width: 60},
                    {label: '摘要', name: 'remark', width: 80},
                    {label: '对方户名', name: 'peer_name', width: 100}
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
    $("#jqGrid").on("click", ".remarkCl", function(){
        var remark = $(this).attr('bind-data');
        $('#remarkLayerContent').val(remark);
        layer.open({
            type: 1,
            skin: 'layui-layer-molv',
            title: "录入意见",
            area: ['550px', '330px'],
            shadeClose: false,
            content: $("#remarkLayer")
        });
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null
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

            var ids = $("#jqGrid").getGridParam("selarrrow");
            if (ids.length <= 0) {
                alert("未选择待审批数据，请确认！");
                return;
            }

            layer.open({
                type: 1,
                skin: 'layui-layer-molv',
                title: "审核结果",
                area: ['550px', '330px'],
                shadeClose: false,
                content: $("#verifyLayer"),
                btn: ['确认', '取消'],
                btn1: function (index) {
                    var verifyOpinion = $("#verifyOpinion").val();
                    var verifyResult = $("#verifyResult").val();
                    if (verifyOpinion == "") {
                        alert("审核意见不能为空,请确认！");
                        return;
                    }

                    var url = '../balogmanupair/submitVerify';
                    var rows = [];
                    for (var i = 0; i < ids.length; i++) {
                        var rowData = $("#jqGrid").getRowData(ids[i]);
                        rows.push(rowData);
                    }
                    var param = {
                        verifyOpinion: verifyOpinion,
                        verifyResult: verifyResult,
                        rows: rows
                    };

                    $.ajax({
                        type: "POST",
                        url: url,
                        data: JSON.stringify(param),
                        success: function (r) {
                            alert(r.msg);
                            layer.close(index);
                            vm.reload();
                        }
                    });
                },
                end: function () {
                    $("#verifyOpinion").val("");
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