$(function () {
    $("#jqGrid").jqGrid({
        url: '../balbizbankmanuallog/list',
        datatype: "json",
        colModel: [			
			{ label: 'bizBankManualId', name: 'bizBankManualId', index: 'biz_bank_manual_id', width: 50, key: true },
			{ label: '对账操作批次号', name: 'reconBatId', index: 'recon_bat_id', width: 80 }, 			
			{ label: '对账批内顺序号', name: 'reconBatSeq', index: 'recon_bat_seq', width: 80 }, 			
			{ label: '调度日期', name: 'schedDate', index: 'sched_date', width: 80 },
			{ label: '平台交易键值', name: 'bizTraceNo', index: 'biz_trace_no', width: 80 },
			{ label: '专户交易键值', name: 'bankTraceNo', index: 'bank_trace_no', width: 80 }, 			
			{ label: '录入用户ID', name: 'createUserId', index: 'create_user_id', width: 80 }, 			
			{ label: '审核用户ID', name: 'verifyUserId', index: 'verify_user_id', width: 80 }, 			
			{ label: '审核状态', name: 'verifyStatus', index: 'verify_status', width: 80 }, 			
			{ label: '录入意见', name: 'createOpinion', index: 'create_opinion', width: 80 }, 			
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
		balBizBankManualLog: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.balBizBankManualLog = {};
		},
		update: function (event) {
			var bizBankManualId = getSelectedRow();
			if(bizBankManualId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(bizBankManualId)
		},
		saveOrUpdate: function (event) {
			var url = vm.balBizBankManualLog.bizBankManualId == null ? "../balbizbankmanuallog/save" : "../balbizbankmanuallog/update";
			$.ajax({
				type: "POST",
			    url: url,
			    data: JSON.stringify(vm.balBizBankManualLog),
			    success: function(r){
			    	if(r.code === 0){
						alert(r, function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		del: function (event) {
			var bizBankManualIds = getSelectedRows();
			if(bizBankManualIds == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: "../balbizbankmanuallog/delete",
				    data: JSON.stringify(bizBankManualIds),
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
		getInfo: function(bizBankManualId){
			$.get("../balbizbankmanuallog/info/"+bizBankManualId, function(r){
                if(r.code == 0){
                    vm.balBizBankManualLog = r.balBizBankManualLog;
                }else{
                    alert(r.msg);
                }
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
                page:page
            }).trigger("reloadGrid");
		}
	}
});