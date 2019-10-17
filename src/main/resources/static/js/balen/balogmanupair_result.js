$(function () {
    $("#jqGrid").jqGrid({
        url: '../balogmanupair/manualResult',
        datatype: "json",
        colModel: [
            {label: '操作批次号', name: 'recon_bat_id', sortable: false, width: 60, key: true},
            {label: '录入用户', name: 'creator', sortable: false, width: 40},
            {label: '录入时间', name: 'ts_create', sortable: false, width: 40},
            {
                label: '录入意见', index: 'remark', width: 50, align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    return "<span bind-data='"+rowObject.remark+"' class='remarkCl' style='display:block; width:100%; cursor:pointer;'>点击查看</span>";
                }
            },
            {label: '状态', name: 'procstat_name', sortable: false, width: 40},
            {label: '状态', name: 'procstat', width: 80, hidden: true},
            {label: '审核用户', name: 'verifier', sortable: false, width: 40},
            {label: '审核时间', name: 'ts_verify', sortable: false, width: 40},
            {
                label: '审核意见', index: 'verify_opinion', width: 50, align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    return "<span bind-data='"+rowObject.verify_opinion+"' class='verifyOpinionCl' style='display:block; width:100%; cursor:pointer;'>点击查看</span>";
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
        // subGridOptions:{
        //     expandOnLoad: false
        // },
        subGridBeforeExpand: function (subgrid_id, row_id) {
            var rows = $("#jqGrid").jqGrid('getRowData', row_id);
            var procstat = rows.procstat;
            if(procstat == -1){
                return false;
            }
        },
        subGridRowExpanded: function (subgrid_id, row_id) {
            var bizsubgrid = "biz" + subgrid_id + "_t";
            var banksubgrid = "bank" + subgrid_id + "_t";
            var rows = $("#jqGrid").jqGrid('getRowData', row_id);

            var procstat = rows.procstat;
            if(procstat == -1){
                return;
            }

            var subGridHtml = "<div style='width:100%;overflow:auto'>";
            subGridHtml += "<div style='width:50%;overflow:auto;float : left;'>";
            subGridHtml += "<table id='" + banksubgrid + "'></table></div>";
            subGridHtml += "<div style='width:50%;overflow:auto;float : right;'>";
            subGridHtml += "<table id='" + bizsubgrid + "'></table></div>";
            subGridHtml += "</div>";
            $("#" + subgrid_id).html(subGridHtml);
            $("#" + bizsubgrid).jqGrid({
                url: '../balogmanupair/queryResultBzdByBatId',
                postData: {"reconBatId": rows.recon_bat_id},
                datatype: "json",
                colModel: [
                    {label: '日期', name: 'bz_recon_date', width: 60},
                    {label: '交易类型', name: 'tran_id', width: 80},
                    {label: '金额', name: 'bz_txn_amt', width: 100},
                    {label: '借贷记标志', name: 'bz_dbocr', width: 60},
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
                url: '../balogmanupair/queryResultBkbByBatId',
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
        $('#cellContent').val(remark);
        layer.open({
            type: 1,
            skin: 'layui-layer-molv',
            title: "录入意见",
            area: ['550px', '330px'],
            shadeClose: false,
            content: $("#cellContentLayer")
        });
    });
    $("#jqGrid").on("click", ".verifyOpinionCl", function(){
        var verifyOpinion = $(this).attr('bind-data');
        $('#cellContent').val(verifyOpinion);
        layer.open({
            type: 1,
            skin: 'layui-layer-molv',
            title: "审核意见",
            area: ['550px', '330px'],
            shadeClose: false,
            content: $("#cellContentLayer")
        });
    });
});

layui.use('laydate', function () {
    var laydate = layui.laydate;
    laydate.render({
        elem: "#reconDate",
        format: "yyyyMMdd"
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
            var postData = {
                'reconDate': $("#reconDate").val()
            };
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            $("#jqGrid").jqGrid('setGridParam', {
                postData: postData,
                page: page
            }).trigger("reloadGrid");
        },
        unbound: function(){
            var ids = $("#jqGrid").getGridParam("selarrrow");
            if (ids.length <= 0) {
                alert("未选择数据，请确认！");
                return;
            }
            if(!vm.checkProcStat(ids)){
                alert("存在状态为已失效的记录，请确认！");
                return;
            }
            layer.confirm('是否确认解除平账?', {icon: 3, title:'提示'}, function(index){

                var param = {
                    ids: ids+''
                };
                var url = "../balogmanupair/submitUnbound";
                $.ajax({
                    type: "POST",
                    url: url,
                    data: JSON.stringify(param),
                    success: function (r) {
                        alert(r.msg);
                        vm.reload();
                    }
                });

                layer.close(index);
            });
        },
        checkProcStat: function (ids) {
            for (var i = 0; i < ids.length; i++) {
                var rowData = $("#jqGrid").getRowData(ids[i]);
                var reconBatId = rowData.recon_bat_id;
                var procstat = rowData.procstat;
                if (procstat == -1) {
                    return false;
                }
            }
            return true;
        }
    }
});

function setRowsStyle() {
    var rowIds = $("#jqGrid").getDataIDs();
    $.each(rowIds, function (index, rowId) {
        $("#jqGrid #" + rowId).find("td").css("background-color", "rgba(43,234,140,0.2)");
    });
}