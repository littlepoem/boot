$(function () {
    $("#jqGrid").jqGrid({
        url: '../balbizdatamanuallog/list',
        datatype: "json",
        colModel: [
			{ label: '平台代码', name: 'platId', index: 'plat_id', width: 80 }, 			
			{ label: '交易代码', name: 'tranId', index: 'tran_id', width: 80 },
            { label: '子交易代码', name: 'subTranId', index: 'sub_tran_id', width: 150,hidden:true},
			{ label: '记录来源', name: 'sources', index: 'sources', width: 80 , formatter: sourceFormatter},
			{ label: '交易日期', name: 'txnDate', index: 'txn_date', width: 80 },
			{ label: '交易时间', name: 'txnTime', index: 'txn_time', width: 80 },
            { label: '业务日期', name: 'bizDate', index: 'biz_date', width: 80 },
			{ label: 'traceNo', name: 'traceNo', index: 'trace_no', width: 50, key: true,hidden:true },
			{ label: '交易笔数', name: 'txnNum', index: 'txn_num', width: 80 },
			{ label: '交易金额', name: 'txnAmt', index: 'txn_amt', width: 80 },
			{ label: '借贷记标志', name: 'dbocr', index: 'dbocr', width: 80 }, 			
			{ label: '记录来源说明', name: 'remark', index: 'remark', width: 80 }, 			
			{ label: '录入用户', name: 'createUserId', index: 'create_user_id', width: 80 },
			{ label: '审核用户', name: 'verifyUserId', index: 'verify_user_id', width: 80 },
			{ label: '审核状态', name: 'verifyStatus', index: 'verify_status', width: 80, formatter: verifyStatusFormatter },
			{ label: '审核意见', name: 'verifyOpinion', index: 'verify_opinion', width: 80 }, 			
			{ label: '记录录入时间', name: 'tsCreate', index: 'ts_create', width: 80 }, 			
			{ label: '记录审核时间', name: 'tsVerify', index: 'ts_verify', width: 80 }			
        ],
		viewrecords: true,
        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
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
});

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		title: null,
		balBizdataManualLog: {},
		operType:null,
        q:{
            platId: null,
            verifyStatus: null
        },
        sourcesOptions:{

        },
        dbocrOptions:{

        }
        ,
        platIdOptions:{

        },
        codeMap:{},
        user:{}
	},
    created:function(){
	    this.getUser();
        var url ="../balbizdatamanuallog/getCodeInfo";
        $.post(url,function (r) {//初始化字典
            if(r.code == 0){
                vm.sourcesOptions=r.codes.sourceCodes;
                vm.dbocrOptions=r.codes.dbocrCodes;
                vm.platIdOptions = r.codes.platIdCodes;
                vm.codeMap = r.codes.codeMapp;
            }else {
            }
        });

    },
    mounted:function () {
        var url ="../balbizdatamanuallog/getInitInfo";
        $.post(url,function (r) {//初始化数据
            if(r.code == 0){
                vm.balBizdataManualLog =r.codes.entityModel;
            }else {
            }
        });
        //this.ajax();
    },
	methods: {
	    ajax:function () {
	        var _this = this;
            var url ="../balbizdatamanuallog/getInitInfo";
            $.post(url,function (r) {
                console.log(r.codes.impBatId);
                _this.init(r.codes.impBatId);
            });
        },
        getUser: function () {
            $.getJSON("../sys/user/info?_" + $.now(), function (r) {
                vm.user = r.user;
            });
        },
        init:function (r) {
            vm.title = r;
            vm.balBizdataManualLog.platId = r;
        },
		query: function () {
			vm.reload();
		},
		add: function(){
            $("#saveBtnId").css("display","");
			vm.showList = false;
			vm.title = "新增";
			vm.balBizdataManualLog = {};
			vm.balBizdataManualLog.instId = "manual";
			vm.operType = "add";
            $("#filesetId1").removeAttr("disabled");
            $("#filesetId2").attr("disabled","true");
		},
        reset: function(){
            vm.q.verifyStatus = null;
            vm.q.platId = null;
            $("#qverifyStatus").val("");

        },
        querycheck: function (event) {
            var traceNo = getSelectedRow();
            if(traceNo == null){
                return ;
            }
            var rowData = $("#jqGrid").jqGrid('getRowData',traceNo);
            var verifyStatus = rowData.verifyStatus;
            vm.showList = false;
            vm.title = "查看";
            vm.operType = "querycheck";
            vm.getInfo(traceNo);
            $("#saveBtnId").css("display","none");
            $("#filesetId1").attr("disabled","true");
            $("#filesetId2").attr("disabled","true");
        },
		update: function (event) {
            $("#saveBtnId").css("display","");
			var traceNo = getSelectedRow();
			if(traceNo == null){
				return ;
			}
            var rowData = $("#jqGrid").jqGrid('getRowData',traceNo);
            var verifyStatus = rowData.verifyStatus;
            if(verifyStatus == "审批通过"){
                alert("该笔记录已审批通过，不能执行该操作！");
                return;
            }
			vm.showList = false;
            vm.title = "修改";
            vm.operType = "update";
            vm.getInfo(traceNo);
            $("#filesetId1").removeAttr("disabled");
            $("#filesetId2").attr("disabled","true");
		},
        approve: function (event) {
	        var loginUserName = vm.user.userName;
            $("#saveBtnId").css("display","");
            var traceNo = getSelectedRow();
            if(traceNo == null){
                return ;
            }
            var rowData = $("#jqGrid").jqGrid('getRowData',traceNo);
            var createUserId = rowData.createUserId;
            if(createUserId == loginUserName){
                alert("该记录为本人申请，不能审批！");
                return;
            }
            var verifyStatus = rowData.verifyStatus;
            if(verifyStatus == "审批通过"){
                alert("该笔记录已审批通过，不能执行该操作！");
                return;
            }
            vm.showList = false;
            vm.title = "审批";
            vm.operType = "approve";
            $("#filesetId2").removeAttr("disabled");
            $("#filesetId1").attr("disabled","true");
            vm.getInfo(traceNo);
        },
		saveOrUpdate: function (event) {
            reloadData();
			var url = vm.balBizdataManualLog.traceNo == null ? "../balbizdatamanuallog/save" : "../balbizdatamanuallog/update";
			$.ajax({
				type: "POST",
			    url: url,
			    data: JSON.stringify(vm.balBizdataManualLog),
			    success: function(r){
			    	if(r.code === 0){
						alert(r, function(index){

						});
					}else{
						alert(r.msg);
					}
                    vm.reload();
				}
			});
		},
		del: function (event) {
			var traceNos = getSelectedRows();
			if(traceNos == null){
				return ;
			}
			for(var i=0; i<=traceNos.length; i++){
			    var  traceNo = traceNos[i];
                var rowData = $("#jqGrid").jqGrid('getRowData',traceNo);
                var verifyStatus = rowData.verifyStatus;
                if(verifyStatus == "审批通过"){
                    alert("存在已审批通过记录，不能执行该操作！");
                    return;
                }
            }

			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: "../balbizdatamanuallog/delete",
				    data: JSON.stringify(traceNos),
				    success: function(r){
						if(r.code == 0){
							alert(r, function(index){
								$("#jqGrid").trigger("reloadGrid");
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		getInfo: function(traceNo){
			$.get("../balbizdatamanuallog/info/"+traceNo, function(r){
                if(r.code == 0){
                    vm.balBizdataManualLog = r.balBizdataManualLog;
                    vm.balBizdataManualLog.operType = vm.operType;
                }else{
                    alert(r.msg);
                }
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
                postData:{'platId': vm.q.platId,'verifyStatus': vm.q.verifyStatus},
                page:page
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
layui.use(['form', 'layedit','laydate'], function(){
    var form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate;

    //执行一个laydate实例
    laydate.render({
        elem: '#txnDateId', //指定元素
        format: 'yyyyMMdd'
        ,done:function (value,date,endDate) {
            vm.balBizdataManualLog.txnDate = value;
        }
    });
    laydate.render({
        elem: '#txnTimeId', //指定元素
        type:'time'
        ,format: 'HHmmss'
        ,done:function (value,date,endDate) {
            vm.balBizdataManualLog.txnTime = value;
        }
    });
    laydate.render({
        elem: '#tsCreateId', //记录录入时间
        type:'datetime'
        ,format: 'yyyy-MM-dd HH:mm:ss'
		,done:function (value,date,endDate) {
            vm.balBizdataManualLog.tsCreate = value;
        }
    });

    form.render('select');

});



function approves(flag){
	var tranceNo = $(".tranceNoId").val();
    if(flag == "pass"){
        vm.balBizdataManualLog.verifyStatus = "1";
	}else if(flag == "nopass"){
        vm.balBizdataManualLog.verifyStatus = "0";
	}
    $.ajax({
        type: "POST",
        url: "../balbizdatamanuallog/approve",
        data: JSON.stringify(vm.balBizdataManualLog),
        success: function(r){
            if(r.code == 0){
                alert(r, function(index){
                    $("#jqGrid").trigger("reloadGrid");
                    vm.showList = true;
                });
            }else{
                alert(r.msg);
            }
        }
    });
}

function verifyStatusFormatter(value, options, row){
    var v = value;
    if(value == 0){
        v = '未审批';
    }else if (value == 1){
        v = '审批通过';
    }else if(value == 2){
        v = '审批不通过';
    }
    return v;
}

function sourceFormatter(value, options, row){
    var v = value;
    if(value == 0){
        v = '手动添加';
    }else if (value == 1){
        v = '程序添加';
    }else if(value == 2){
        v = '交易记录';
    }else if(value == 3){
        v = '报表数据';
    }
    return v;
}

function verifyStatusChange() {
    var selVal = $("#qverifyStatus").val();
    vm.q.verifyStatus = selVal;
}

function  reloadData() {
    var tranId = vm.balBizdataManualLog.tranId;
    if(tranId == "Einterest"){
        vm.balBizdataManualLog.tranName = "银行利息到账"
    }else if(tranId == "Einturnin"){
        vm.balBizdataManualLog.tranName = "银联总公司上划利息"
    }else if(tranId == "Eother"){
        vm.balBizdataManualLog.tranName = "其它手工添加"
    }
}