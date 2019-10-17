$(function () {
    $("#jqGrid").jqGrid({
        url: '../balbizcheckrslt/list?whereFrom=T0HK',
        datatype: "json",
        colModel: [
            { label: 'bizCheckRsltId', name: 'bizCheckRsltId', index: 'bizcheck_rslt_id', width: 50, key: true,hidden:true },
            { label: '批次号', name: 'actId', index: 'act_id', width: 50},
            { label: '调度日期', name: 'schedDate', index: 'sched_date', width: 80 },
            { label: '金服平台代码', name: 'platId', index: 'plat_id', width: 80 },
            { label: '检查项目代码', name: 'actCode', index: 'act_code', width: 80 },
            { label: '金服机构代码', name: 'instId', index: 'inst_id', width: 80 },
            { label: '结果代码', name: 'respCode', index: 'resp_code', width: 80,formatter: respCodeFormatter },
            { label: '执行结果描述', name: 'respMsg', index: 'resp_msg', width: 80 },
            { label: '记录更新日期', name: 'tsLastUpdate', index: 'ts_last_update', width: 80 }
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
		balBizcheckRslt: {},
        platId: '',
        checkType:'',
        platIdOptions:{}
	},
    created:function(){
        var url ="../balbizdatamanuallog/getCodeInfo";
        $.post(url,function (r) {//初始化字典
            if(r.code == 0){
                vm.platIdOptions = r.codes.platIdCodes;
            }else {
            }
        });

    },
	methods: {
        reset: function(){
            vm.platId = "";
            $("#scheduleDate").val("");
        },
        check: function () {
            var url = "../balPlatfromRecon/checkPlatfromRecon";
            var date = $("#scheduleDate").val();
            var platId = $("#platformId").val();
            if (date == ""){
                alert("请选择调度日期！");
                return false;
            };
            layer.load();
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify({'platId': platId , 'date' : date}),
                success: function(r){
                    layer.closeAll('loading');
                    if(r.code == 0){
                        alert(r, function(index){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });


        },
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.balBizcheckRslt = {};
		},
		update: function (event) {
			var actId = getSelectedRow();
			if(actId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(actId)
		},
		saveOrUpdate: function (event) {
			var url = vm.balBizcheckRslt.actId == null ? "../balbizcheckrslt/save" : "../balbizcheckrslt/update";
			$.ajax({
				type: "POST",
			    url: url,
			    data: JSON.stringify(vm.balBizcheckRslt),
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
			var actIds = getSelectedRows();
			if(actIds == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: "../balbizcheckrslt/delete",
				    data: JSON.stringify(actIds),
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
		getInfo: function(actId){
			$.get("../balbizcheckrslt/info/"+actId, function(r){
                if(r.code == 0){
                    vm.balBizcheckRslt = r.balBizcheckRslt;
                }else{
                    alert(r.msg);
                }
            });
		},
        reload: function (event) {
            vm.showList = true;
            var page = 1;
            var date = $("#scheduleDate").val();
            var platId = $("#platformId").val();
            $("#jqGrid").jqGrid('setGridParam',{
                postData:{'platId':platId,'jyrq':date,'whereFrom':'T0HK'},
                page:page
            }).trigger("reloadGrid");
        }
    }
});

function respCodeFormatter(value, options, row){
    var v = value;
    if(value == 1){
        v = '账不平';
    }else if (value == 0){
        v = '平账';
    }
    return v;
}

layui.use('laydate', function(){
    var laydate = layui.laydate;

    //执行一个laydate实例
    laydate.render({
        elem: '#scheduleDate', //指定元素
    });

    
});