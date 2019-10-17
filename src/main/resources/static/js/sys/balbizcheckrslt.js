$(function () {

    var url = location.search; //获取url中"?"符后的字串 ('?modFlag=business&role=1')
    var theRequest = new Object();
    if ( url.indexOf( "?" ) != -1 ) {
        var str = url.substr(1); //substr()方法返回从参数值开始到结束的字符串；
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    var jyrq = "";
    var respCode = "";
    var type = "";
    if(url != "" && url != null){
        $("#back").css('display','block');
        jyrq = theRequest.nowDate;
        respCode = theRequest.respCode;
        type = theRequest.typeId;
    }

    $("#jqGrid").jqGrid({
        url: '../balbizcheckrslt/list',
        datatype: "json",
        postData:{'jyrq':jyrq,'rslt':respCode,'type':type},
        colModel: [
            { label: 'bizCheckRsltId', name: 'bizCheckRsltId', index: 'bizcheck_rslt_id', width: 50, key: true,hidden:true },
			{ label: '批次号', name: 'actId', index: 'act_id', width: 80},
			{ label: '调度日期', name: 'schedDate', index: 'sched_date', width: 60 },
			{ label: '检查项目代码', name: 'actCode', index: 'act_code', width: 60 },
			{ label: '金服平台代码', name: 'platId', index: 'plat_id', width: 50 },
			{ label: '金服机构代码', name: 'instId', index: 'inst_id', width: 50 },
            { label: '金服机构名称', name: 'instName', index: 'instName', width: 50 },
			{ label: '结果代码', name: 'respCode', index: 'resp_code', width: 50  ,formatter: respCodeFormatter},
			{ label: '执行结果描述', name: 'respMsg', index: 'resp_msg', width: 280 },
			{ label: '记录更新日期', name: 'tsLastUpdate', index: 'ts_last_update', width: 80}
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
    getPlatEquation();
});

var vm = new Vue({
	el:'#rrapp',
	data:{
		showList: true,
		title: null,
		balBizcheckRslt: {},
		date: '',
		platId: '',
        platIdOptions:{},
		rslt:"",
        instName:"",
        equation:"",
        platEquationList:{}
		
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
            vm.rslt = "";
            vm.instName = "";
            $("#equation").val("");
            $("#scheduleDate").val("");
        },
		query: function () {
			vm.reload();
		},
        back: function (event) {
            history.go(-1);
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
            var date = $("#scheduleDate").val();
            var equation = $("#equation").val();
			var page = 1;
			$("#jqGrid").jqGrid('setGridParam',{ 
				postData:{'jyrq':date,'platId':vm.platId,'rslt':vm.rslt,'instName':vm.instName,'equation':equation},
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

function getPlatEquation(){
    var url ="../balPlatfromRecon/getPlatEquationList";
    var platId = $("#platformId").val();
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify({'platId': platId}),
        success: function(r){
            if(r.code == 0){
               vm.platEquationList = r.platEquationList;
            }else{
                alert(r.msg);
            }
        }
    });

}