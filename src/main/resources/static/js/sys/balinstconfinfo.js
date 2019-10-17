$(function () {
    $("#jqGrid").jqGrid({
        url: '../balinstconfinfo/list',
        datatype: "json",
        colModel: [			
			{ label: 'instConfId', name: 'instConfId', index: 'inst_conf_id', width: 50, key: true },
			{ label: '平台代码', name: 'platId', index: 'plat_id', width: 80 }, 			
			{ label: '机构号', name: 'instId', index: 'inst_id', width: 80 }, 			
			{ label: '机构名称简称', name: 'instShortName', index: 'inst_short_name', width: 80 }, 			
			{ label: '机构名称', name: 'instName', index: 'inst_name', width: 80 }, 			
			{ label: '专户匹配关键字', name: 'accountMatchKey', index: 'account_match_key', width: 80 }, 			
			{ label: '专户历史匹配关键字', name: 'accountHisMatchKey', index: 'account_his_match_key', width: 80 },
			{ label: '支付机构标识码', name: 'payInsIdCd', index: 'pay_ins_id_cd', width: 80 },
			{ label: '收单机构标识码', name: 'acqInsIdCd', index: 'acq_ins_id_cd', width: 80 }, 			
			{ label: 'T1代收模式', name: 't1CollectMode', index: 't1_collect_mode', width: 80 }, 			
			{ label: '计息方式', name: 'computeInterestMode', index: 'compute_interest_mode', width: 80 }, 			
			{ label: '手续费扣收模式', name: 'chargeFeeDeductionMode', index: 'charge_fee_deduction_mode', width: 80 }, 			
			{ label: '全渠道T0代付商户编号', name: 't0PayMerId', index: 't0_pay_mer_id', width: 80 }, 			
			{ label: 'T1代付商户编号', name: 't1PayMerId', index: 't1_pay_mer_id', width: 80 }, 			
			{ label: '银行来去账匹配关键字', name: 'bankMatchKey', index: 'bank_match_key', width: 80 },
			{ label: '账户号', name: 'acctNo', index: 'acct_no', width: 80 },
			{ label: '账户名称', name: 'acctName', index: 'acct_name', width: 80 },
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
        q: {
            platId: null,
            acqInsIdCd: null,
            instId:null
        },
		showList: true,
		title: null,
        platIdCode:{},
		balInstConfInfo: {}

	},
    created: function () {
        var url = "../balbizdatalog/getCodeMap";
        $.post(url, function (r) {//初始化字典
            if (r.code == 0) {
                vm.platIdCode = r.codes.platIdCode;
            } else {
            }
        });

    },
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.balInstConfInfo = {};
		},
        reset: function () {
            $("#platId").val("");
            vm.q.instId = "";
            vm.q.acqInsIdCd = "";
        },
		update: function (event) {
			var instConfId = getSelectedRow();
			if(instConfId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(instConfId)
		},
		saveOrUpdate: function (event) {
			var url = vm.balInstConfInfo.instConfId == null ? "../balinstconfinfo/save" : "../balinstconfinfo/update";
			$.ajax({
				type: "POST",
			    url: url,
			    data: JSON.stringify(vm.balInstConfInfo),
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
			var instConfIds = getSelectedRows();
			if(instConfIds == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: "../balinstconfinfo/delete",
				    data: JSON.stringify(instConfIds),
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
		getInfo: function(instConfId){
			$.get("../balinstconfinfo/info/"+instConfId, function(r){
                if(r.code == 0){
                    vm.balInstConfInfo = r.balInstConfInfo;
                }else{
                    alert(r.msg);
                }
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
                postData: {'platId': $("#platId").val(), 'acqInsIdCd': vm.q.acqInsIdCd, 'instId': vm.q.instId},
                page:page
            }).trigger("reloadGrid");
		}
	}
});