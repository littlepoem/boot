$(function () {
    $("#jqGrid").jqGrid({
        url: '../balacqconfinfo/list',
        datatype: "json",
        colModel: [			
			{ label: 'acqConfId', name: 'acqConfId', index: 'acq_conf_id', width: 50, key: true },
			{ label: '收单机构标识码', name: 'acqInsIdCd', index: 'acq_ins_id_cd', width: 80 }, 			
			{ label: '收单银行', name: 'acqBank', index: 'acq_bank', width: 80 }, 			
			{ label: '日切时间', name: 'cutTime', index: 'cut_time', width: 80 }, 			
			{ label: '银联专户账号', name: 'acctNo', index: 'acct_no', width: 80 }, 			
			{ label: '收单RD1002借贷项', name: 'acqRd1002Dbocr', index: 'acq_rd1002_dbocr', width: 80 }, 			
			{ label: '修改用户ID', name: 'updateUserId', index: 'update_user_id', width: 80 }, 			
			{ label: '创建时间', name: 'crtDt', index: 'crt_dt', width: 80 }, 			
			{ label: '更新时间', name: 'updDt', index: 'upd_dt', width: 80 }			
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
		balAcqConfInfo: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.balAcqConfInfo = {};
		},
		update: function (event) {
			var acqConfId = getSelectedRow();
			if(acqConfId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(acqConfId)
		},
		saveOrUpdate: function (event) {
			var url = vm.balAcqConfInfo.acqConfId == null ? "../balacqconfinfo/save" : "../balacqconfinfo/update";
			$.ajax({
				type: "POST",
			    url: url,
			    data: JSON.stringify(vm.balAcqConfInfo),
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
			var acqConfIds = getSelectedRows();
			if(acqConfIds == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: "../balacqconfinfo/delete",
				    data: JSON.stringify(acqConfIds),
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
		getInfo: function(acqConfId){
			$.get("../balacqconfinfo/info/"+acqConfId, function(r){
                if(r.code == 0){
                    vm.balAcqConfInfo = r.balAcqConfInfo;
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