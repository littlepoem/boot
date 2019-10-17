$(function () {
    var viewHeight = 450;
    var viewRownumWidth = 25;
    $("#jqGridBiz").jqGrid({
        title: '平台侧',
        datatype: "json",
        colModel: [
            {label: '交易键值', name: 'traceNo', width: 80, key: true, hidden: true},
            {label: '对账日期', name: 'reconDate', width: 80},
            {label: '交易日期', name: 'txnDate', width: 80},
            {label: '交易类型名称', name: 'tranName', width: 80},
            {label: '交易金额', name: 'txnAmt', width: 100},
            {label: '机构号', name: 'instId', width: 80},
            {label: '机构名称', name: 'shh', width: 80},
            {label: '开户行', name: 'acqInsName', width: 60},
            {label: '借贷记标志', name: 'dbocr', width: 40},
            {label: '交易结果', name: 'respCode', width: 40},
            {label: '批次', name: 'reconBatId', width: 40},
            {label: '序号', name: 'reconBatSeq', width: 40},
            {
                label: '详情', index: 'operate', width: 50, align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    var detail = "<a onclick=btn_bizdetail(\"" + rowObject.traceNo + "\") title='详细信息'>详</a>";
                    return detail;
                },
            }
        ],
        rowNum: -1,
        viewrecords: true,
        height: viewHeight,
        rownumbers: true,
        rownumWidth: viewRownumWidth,
        autowidth: true,
        multiselect: true
    });
    $("#jqGridBank").jqGrid({
        datatype: "json",
        colModel: [
            {label: '交易键值', name: 'traceNo', width: 80, key: true, hidden: true},
            {label: '对账日期', name: 'reconDate', width: 80},
            {label: '交易日期', name: 'txnDate', width: 80},
            {label: '开户行', name: 'bankName', width: 60},
            {label: '交易金额', name: 'txnAmt', width: 100},
            {label: '摘要', name: 'remark', width: 80},
            {label: '对方户名', name: 'peerName', width: 80},
            {label: '借贷记标志', name: 'dbocr', width: 40},
            {label: '批次', name: 'reconBatId', width: 40},
            {label: '序号', name: 'reconBatSeq', width: 40},
            {
                label: '详情', index: 'operate', width: 50, align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    var detail = "<a onclick=btn_bankdetail(\"" + rowObject.traceNo + "\") title='详细信息'>详</a>";
                    return detail;
                },
            }
        ],
        rowNum: -1,
        viewrecords: true,
        height: viewHeight,
        rownumbers: true,
        rownumWidth: viewRownumWidth,
        autowidth: true,
        multiselect: true
    });

});

layui.use('laydate', function () {
    var laydate = layui.laydate;
    laydate.render({
        elem: "#natureDt",
        format: "yyyyMMdd"
    });
});

var bizData, bankData;
var opinionObjects = new Map();

// $.ajax({async: false});
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
        allocationBatch: function () {
            $("#createOpinion").val("");
            var bizIds = $("#jqGridBiz").getGridParam("selarrrow");
            var bankIds = $("#jqGridBank").getGridParam("selarrrow");
            if (checkBizAndBank(bizIds, bankIds)) {
                var batSeq = $("#batSeq").val();
                if (batSeq == '') {
                    alert("顺序号不能为空,请确认！");
                    return;
                }
                layer.open({
                    type: 1,
                    skin: 'layui-layer-molv',
                    title: "请输入录入意见",
                    area: ['550px', '270px'],
                    shadeClose: false,
                    content: $("#opinionLayer"),
                    btn: ['确认', '取消'],
                    btn1: function (index) {
                        var createOpinion = $("#createOpinion").val();
                        if (createOpinion == "") {
                            alert("录入意见不能为空,请确认！");
                            return;
                        }
                        layer.close(index);
                        allocationBatIdAndSeq(createOpinion);
                    }
                });
            }
        },
        loadUnBalanceRecord: function () {
            var url = "../balbankbooklog/balanceManual";
            var natureDt = $("#natureDt").val();
            if (natureDt.length <= 0) {
                alert("对账日期不能为空，请输入对账日期！");
                return;
            }
            var bankId = $("#bankId").val();
            var respCode = $("#respCode").val();
            layer.load();
            $.ajax({
                type: "POST",
                data: JSON.stringify({'natureDt': natureDt, 'bankId': bankId, 'respCode': respCode}),
                url: url,
                success: function (r) {
                    layer.closeAll('loading');
                    if (r.code == 0) {
                        bizData = r.datas.bizdatas;
                        bankData = r.datas.bankdatas;
                        $("#batId").val(r.datas.batId);
                        $("#batSeq").val(r.datas.batSeq);
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
        saveUnBalanceRecord: function () {
            var opinions = {};
            var isPass = true;
            opinionObjects.forEach(function (value, key, map) {
                opinions[key] = value;
                isPass = false;
            });
            if (isPass) {
                alert("未分配批次号，不能保存！");
                return;
            }
            var url = "../balbankbooklog/saveUnBalanceRecord";
            var bizRows = $("#jqGridBiz").getRowData();
            var bankRows = $("#jqGridBank").getRowData();
            var bizRowsIds = $("#jqGridBiz").jqGrid('getDataIDs');
            var bankRowsIds = $("#jqGridBank").jqGrid('getDataIDs');
            var natureDt = $("#natureDt").val();
            bizRows.push($("#jqGridBiz").getRowData(bizRowsIds[bizRowsIds.length - 1]));
            bankRows.push($("#jqGridBank").getRowData(bankRowsIds[bankRowsIds.length - 1]));
            var batId = $("#batId").val();
            var resData = {
                "bizRows": bizRows,
                "bankRows": bankRows,
                "batId": batId,
                "opinionObjects": opinions,
                "natureDt": natureDt
            };
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(resData),
                success: function (r) {
                    alert(r.msg);
                }
            });
        }

    }
});

function allocationBatIdAndSeq(createOpinion) {
    var batId = $("#batId").val();
    var batSeq = $("#batSeq").val();
    var randomColor = randomColors();
    var bizIds = $("#jqGridBiz").getGridParam("selarrrow");
    var bankIds = $("#jqGridBank").getGridParam("selarrrow");
    for (var i = 0; i < bizIds.length; i++) {
        var rowData = $("#jqGridBiz").getRowData(bizIds[i]);
        if (rowData.reconBatId != '') {
            renewBizAndBankStyle(rowData.reconBatId, rowData.reconBatSeq);
        }
        setBizStyle(bizIds[i], randomColor, batId, batSeq);
    }
    for (var j = 0; j < bankIds.length; j++) {
        var rowData = $("#jqGridBank").getRowData(bankIds[j]);
        if (rowData.reconBatId != '') {
            renewBizAndBankStyle(rowData.reconBatId, rowData.reconBatSeq);
        }
        setBankStyle(bankIds[j], randomColor, batId, batSeq);
    }
    opinionObjects.set(batSeq, createOpinion);
    batSeq++;
    $("#batSeq").val(batSeq);
    $("#jqGridBiz").jqGrid('resetSelection');
    $("#jqGridBank").jqGrid('resetSelection');
}

function checkBizAndBank(bizIds, bankIds) {
    if (bizIds.length <= 0) {
        alert("平台侧未选择数据，不能分配批次号！");
        return false;
    }
    if (bankIds.length <= 0) {
        alert("账户侧未选择数据，不能分配批次号！");
        return false;
    }
    var amtBiz = 0, amtBank = 0;
    for (var i = 0; i < bizIds.length; i++) {
        var rowData = $("#jqGridBiz").getRowData(bizIds[i]);
        var dbocr = rowData.dbocr;
        var txnAmt = rowData.txnAmt;
        if (dbocr == "C") {
            amtBiz = parseFloat(amtBiz) + parseFloat(txnAmt);
        } else if (dbocr == "D") {
            amtBiz = parseFloat(amtBiz) - parseFloat(txnAmt);
        }
    }
    for (var i = 0; i < bankIds.length; i++) {
        var rowData = $("#jqGridBank").getRowData(bankIds[i]);
        var dbocr = rowData.dbocr;
        var txnAmt = rowData.txnAmt;
        if (dbocr == "C") {
            amtBank = parseFloat(amtBank) + parseFloat(txnAmt);
        } else if (dbocr == "D") {
            amtBank = parseFloat(amtBank) - parseFloat(txnAmt);
        }
    }
    if (amtBiz != amtBank || amtBiz == 0 || amtBank == 0) {
        if (Math.abs(amtBiz) == Math.abs(amtBank) && amtBank != 0) {
            alert("平台侧与账户侧金额相同，但借贷标志不同，请慎重分配批次号！");
        } else {
            alert("平台侧与账户侧金额不同，请慎重分配批次号！");
        }
        return true;
    } else
        return true;

}

function renewBizAndBankStyle(batId, seq) {
    var bizRows = $("#jqGridBiz").jqGrid('getDataIDs');
    var bankRows = $("#jqGridBank").jqGrid('getDataIDs');
    for (var i = 0; i < bizRows.length; i++) {
        var row = $("#jqGridBiz").jqGrid('getRowData', bizRows[i]);
        if (row.reconBatId == batId && row.reconBatSeq == seq) {
            setBizStyle(bizRows[i], "#ffffff", " ", " ");
        }
    }
    for (var i = 0; i < bankRows.length; i++) {
        var row = $("#jqGridBank").jqGrid('getRowData', bankRows[i]);
        if (row.reconBatId == batId && row.reconBatSeq == seq) {
            setBankStyle(bankRows[i], "#ffffff", " ", " ");
        }
    }
    opinionObjects.delete(seq);
}

function setBizStyle(id, color, batId, seq) {
    $("#jqGridBiz #" + id).find("td").css("background-color", "rgba(" + color + ",0.4)");
    $("#jqGridBiz").jqGrid('setCell', id, "reconBatId", batId);
    $("#jqGridBiz").jqGrid('setCell', id, "reconBatSeq", seq);
}

function setBankStyle(id, color, batId, seq) {
    $("#jqGridBank #" + id).find("td").css("background-color", "rgba(" + color + ",0.4)");
    $("#jqGridBank").jqGrid('setCell', id, "reconBatId", batId);
    $("#jqGridBank").jqGrid('setCell', id, "reconBatSeq", seq);
}

function btn_bizdetail(id) {
    var row = $("#jqGridBiz").jqGrid('getRowData', id);
    if (row.reconBatSeq != "" && row.reconBatSeq != 0) {
        alert(opinionObjects.get(row.reconBatSeq));
    }
}

function btn_bankdetail(id) {
    var row = $("#jqGridBank").jqGrid('getRowData', id);
    if (row.reconBatSeq != "" && row.reconBatSeq != 0) {
        alert(opinionObjects.get(row.reconBatSeq));
    }
}

function randomColors() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return r + "," + g + "," + b;

}

