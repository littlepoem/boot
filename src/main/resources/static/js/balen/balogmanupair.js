$(function () {
    var viewHeight = 450;
    $("#jqGridBiz").jqGrid({
        title: '平台侧',
        datatype: "json",
        colModel: [
            {label: '交易键值', name: 'traceNo', width: 80, key: true, hidden: true},
            {label: '对账日期', name: 'reconDate', sortable: false, width: 80},
            {label: '交易日期', name: 'txnDate', sortable: false, width: 80},
            {label: '交易类型', name: 'tranName', sortable: false, width: 80},
            {
                label: '交易金额', name: 'txnAmt', align: 'right', sortable: false, width: 110,
                formatter: 'number', formatoptions:{
                    thousandsSeparator: '',
                    decimalPlaces: 2
                }
            },
            {label: '借贷', name: 'dbocr', sortable: false, width: 50},
            {label: '机构号', name: 'instId', sortable: false, width: 80},
            {label: '机构名称', name: 'shh', sortable: false, width: 80},
            {label: '开户行', name: 'acqInsName', sortable: false, width: 80},
            {label: '交易结果', name: 'respCode', sortable: false, width: 80},
            {label: '附言', name: 'remark', sortable: false, width: 100},
            {label: '流水号', name: 'traceNo', sortable: false, width: 100}
        ],
        rowNum: -1,
        viewrecords: true,
        height: viewHeight,
        rownumbers: true,
        rownumWidth: 45,
        autowidth: true,
        multiselect: true,
        shrinkToFit:false,
        autoScroll: true,
        onSelectRow: function (rowid,status) {
            $("#bzAmtSum").html(vm.calAmtBiz());
            refreshBzCount();
            refreshSumDiff();
        },
        onSelectAll: function (aRowids,status) {
            $("#bzAmtSum").html(vm.calAmtBiz());
            refreshBzCount();
            refreshSumDiff();
        }
    });
    $("#jqGridBank").jqGrid({
        datatype: "json",
        colModel: [
            {label: '交易键值', name: 'traceNo', width: 80, key: true, hidden: true},
            {label: '对账日期', name: 'reconDate', sortable: false, width: 80},
            {label: '交易日期', name: 'txnDate', sortable: false, width: 80},
            {label: '开户行', name: 'bankName', sortable: false, width: 80},
            {
                label: '交易金额', name: 'txnAmt', align: 'right', sortable: false, width: 110,
                formatter: 'number', formatoptions:{
                    thousandsSeparator: '',
                    decimalPlaces: 2
                }
            },
            {label: '借贷', name: 'dbocr', sortable: false, width: 50},
            {label: '摘要', name: 'remark', sortable: false, width: 100},
            {label: '用途', name: 'intent', sortable: false, width: 100},
            {label: '对方账户', name: 'peerAcct', sortable: false, width: 80},
            {label: '对方户名', name: 'peerName', sortable: false, width: 80},
            {label: '对方开户行', name: 'peerank', sortable: false, width: 100},
            {label: '交易时间', name: 'txnTime', sortable: false, width: 100},
            {label: '交易流水号', name: 'traceNo', sortable: false, width: 100}
        ],
        rowNum: -1,
        viewrecords: true,
        height: viewHeight,
        rownumbers: true,
        rownumWidth: 45,
        autowidth: true,
        multiselect: true,
        shrinkToFit:false,
        autoScroll: true,
        onSelectRow: function (rowid,status) {
            $("#bkAmtSum").html(vm.calAmtBank());
            refreshBkCount();
            refreshSumDiff();
        },
        onSelectAll: function (aRowids,status) {
            $("#bkAmtSum").html(vm.calAmtBank());
            refreshBkCount();
            refreshSumDiff();
        }
    });

});

var refreshBzCount = function(){

    var bizIds = $("#jqGridBiz").getGridParam("selarrrow");
    $("#bzCount").html(bizIds.length);
};

var refreshBkCount = function(){

    var bankIds = $("#jqGridBank").getGridParam("selarrrow");
    $("#bkCount").html(bankIds.length);
};
/**
 * 刷新差值
 */
var refreshSumDiff = function(){

    var bzAmtSum = new BigDecimal($("#bzAmtSum").html());
    var bkAmtSum = new BigDecimal($("#bkAmtSum").html());

    //平台侧差值
    var bzSumDiff = bzAmtSum.subtract(bkAmtSum);
    $("#bzSumDiff").html(bzSumDiff.toString());

    //账户侧差值
    var bkSumDiff = bkAmtSum.subtract(bzAmtSum);
    $("#bkSumDiff").html(bkSumDiff.toString());
};

/**
 * 重置各统计值
 */
var reloadAmtSum = function(){

    $("#bzAmtSum").html("0.00");
    $("#bzSumDiff").html("0.00");
    $("#bzCount").html("0");

    $("#bkAmtSum").html("0.00");
    $("#bkSumDiff").html("0.00");
    $("#bkCount").html("0");
}

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

var bizData, bankData;

var vm = new Vue({
    el: '#rrapp',
    data: {
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
            }
        });
    },
    methods: {
        loadUnBalanceRecord: function () {

            var beginDate = $("#beginDate").val();
            var endDate = $("#endDate").val();
            if (beginDate.length <= 0) {
                alert("请输入对账开始日期！");
                return;
            }
            if (endDate.length <= 0) {
                alert("请输入对账结束日期！");
                return;
            }
            var respCode = $("#respCode").val();
            var tranName = $("#tranName").val();
            var instId = $("#instId").val();

            var bankId = $("#bankId").val();
            var remark = $("#remark").val();
            var intent = $("#intent").val();
            var peerAcct = $("#peerAcct").val();
            var peerName = $("#peerName").val();

            var params = {
                'beginDate': beginDate,
                'endDate': endDate,
                'respCode': respCode,
                'tranName': $.trim(tranName),//去除前后空格
                'instId': $.trim(instId),//去除前后空格
                'bankId': bankId,
                'remark': $.trim(remark),//去除前后空格
                'intent': $.trim(intent),//去除前后空格
                'peerAcct': $.trim(peerAcct),//去除前后空格
                'peerName': $.trim(peerName) //去除前后空格
            };

            layer.load();
            var url = "../balogmanupair/unBalanceRecord";
            $.ajax({
                type: "POST",
                data: JSON.stringify(params),
                url: url,
                success: function (r) {
                    layer.closeAll('loading');
                    reloadAmtSum();//重置统计值
                    if (r.code == 0) {
                        bizData = r.datas.bizdatas;
                        bankData = r.datas.bankdatas;
                        $("#jqGridBiz").jqGrid('clearGridData');  //清空表格
                        $("#jqGridBiz").jqGrid('setGridParam', {  // 重新加载数据
                            datatype: 'local',
                            data: bizData,   //  newdata 是符合格式要求的需要重新加载的数据
                            page: 1
                        }).trigger("reloadGrid");
                        $("#jqGridBank").jqGrid('clearGridData');  //清空表格
                        $("#jqGridBank").jqGrid('setGridParam', {  // 重新加载数据
                            datatype: 'local',
                            data: bankData,   //  newdata 是符合格式要求的需要重新加载的数据
                            page: 1
                        }).trigger("reloadGrid");
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        submitBalance: function(){

            var bizIds = $("#jqGridBiz").getGridParam("selarrrow");
            var bankIds = $("#jqGridBank").getGridParam("selarrrow");

            if (bizIds.length <= 0 && bankIds.length <= 0) {
                alert("未选择数据，请确认！");
                return;
            }

            var amtBiz = vm.calAmtBiz();
            var amtBank = vm.calAmtBank();

            if (amtBiz != amtBank) {
                if (Math.abs(amtBiz) == Math.abs(amtBank)) {

                    layer.confirm('平台侧与账户侧金额相同，但借贷标志不同,是否确认提交平账?', {icon: 3, title:'提示'}, function(index){

                        vm.submit(bizIds,bankIds);

                        layer.close(index);
                    });

                } else {

                    layer.confirm('平台侧与账户侧金额不同,是否确认提交平账?', {icon: 3, title:'提示'}, function(index){

                        vm.submit(bizIds,bankIds);

                        layer.close(index);
                    });

                }
            }else {
                layer.confirm('是否确认提交平账?', {icon: 3, title:'提示'}, function(index){

                    vm.submit(bizIds,bankIds);

                    layer.close(index);
                });
            }

        },
        submit: function(bizIds,bankIds){

            layer.open({
                type: 1,
                skin: 'layui-layer-molv',
                title: "请输入录入意见",
                area: ['550px', '270px'],
                shadeClose: false,
                content: $("#opinionLayer"),
                btn: ['确认', '取消'],
                btn1: function (index) {
                    var remark = $("#opRemark").val();
                    if (remark == "") {
                        alert("录入意见不能为空,请确认！");
                        return;
                    }
                    layer.close(index);

                    var bizRows = [];
                    for (var i = 0; i < bizIds.length; i++) {
                        var rowData = $("#jqGridBiz").getRowData(bizIds[i]);
                        bizRows.push(rowData);
                    }
                    var bankRows = [];
                    for (var i = 0; i < bankIds.length; i++) {
                        var rowData = $("#jqGridBank").getRowData(bankIds[i]);
                        bankRows.push(rowData);
                    }

                    var param = {
                        bizRows: bizRows,
                        bankRows: bankRows,
                        remark: remark
                    };
                    var url = "../balogmanupair/submitBalance";
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: JSON.stringify(param),
                        success: function (r) {
                            alert(r.msg);
                            vm.loadUnBalanceRecord();
                        }
                    });
                },
                end: function () {
                    $("#opRemark").val("");
                }
            });


        },
        calAmtBiz: function(){
            var amtBiz = new BigDecimal("0.00");
            var bizIds = $("#jqGridBiz").getGridParam("selarrrow");
            for (var i = 0; i < bizIds.length; i++) {
                var rowData = $("#jqGridBiz").getRowData(bizIds[i]);
                var dbocr = rowData.dbocr;
                var txnAmt = new BigDecimal(rowData.txnAmt);
                if (dbocr == "C") {
                    amtBiz = amtBiz.add(txnAmt);
                } else if (dbocr == "D") {
                    amtBiz = amtBiz.subtract(txnAmt);
                }
            }
            return amtBiz.toString();
        },
        calAmtBank: function(){
            var amtBank = new BigDecimal("0.00");
            var bankIds = $("#jqGridBank").getGridParam("selarrrow");
            for (var i = 0; i < bankIds.length; i++) {
                var rowData = $("#jqGridBank").getRowData(bankIds[i]);
                var dbocr = rowData.dbocr;
                var txnAmt = new BigDecimal(rowData.txnAmt);
                if (dbocr == "C") {
                    amtBank = amtBank.add(txnAmt);
                } else if (dbocr == "D") {
                    amtBank = amtBank.subtract(txnAmt);
                }
            }
            return amtBank.toString();
        }
    }
});
