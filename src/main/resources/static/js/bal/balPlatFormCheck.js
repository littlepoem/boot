$(function () {
    $("#jqGrid").jqGrid({
        url: '../balplatformcheck/list',
        datatype: "json",
        colModel: [			
			{ label: '批次号', name: 'actId', index: 'act_id', width: 120, key: true },
			{ label: '调度日期', name: 'schedDate', index: 'sched_date', width: 80 },
			{ label: '检查项目代码', name: 'actCode', index: 'act_code', width: 80 },
			{ label: '检查项目名称', name: 'actName', index: 'act_name', width: 80 },
			{ label: '金服平台代码', name: 'platId', index: 'plat_id', width: 80 }, 			
			{ label: '金服机构代码', name: 'instId', index: 'inst_id', width: 80 }, 			
			{ label: '结果代码', name: 'respCode', index: 'resp_code', width: 80,formatter: respCodeFormatter1 },
			{ label: '执行结果描述', name: 'respMsg', index: 'resp_msg', width: 350 },
			{ label: '发起方式', name: 'kickFrom', index: 'kick_from', width: 80,hidden:true  },
			{ label: '记录更新日期', name: 'tsLastUpdate', index: 'ts_last_update', width: 80 }
        ],
		viewrecords: true,
        height: 255,
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

    $("#jqGrid2").jqGrid({
        url: '../balplatformcheck/list2',
        datatype: "json",
        colModel: [
            { label: '批次号', name: 'batId', index: 'bat_id', width: 100, key: true },
            { label: '调度日期', name: 'schedDate', index: 'sched_date', width: 80 },
            { label: '操作代码', name: 'batCode', index: 'bat_code', width: 80 },
            { label: '操作名称', name: 'batName', index: 'bat_name', width: 80 },
            { label: '金服平台代码', name: 'platId', index: 'plat_id', width: 80 },
            { label: '成功记录数', name: 'numSucc', index: 'num_succ', width: 80 },
            { label: '失败记录数', name: 'numFail', index: 'num_fail', width: 80 },
            { label: '执行结果代码', name: 'respCode', index: 'resp_code', width: 80,formatter: respCodeFormatter },
            { label: '执行结果描述', name: 'respMsg', index: 'resp_msg', width: 80 },
            { label: '发起方式', name: 'kickFrom', index: 'kick_from', width: 80,formatter: kickFromFormatter },
            { label: '记录更新日期', name: 'tsLastUpdate', index: 'ts_last_update', width: 80 }
        ],
        viewrecords: true,
        height: 185,
        rowNum: 10,
        rowList : [10,30,50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager2",
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
            $("#jqGrid2").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });
        }
    });
});

var vm = new Vue({
	el:'#rrapp',
	data:{
        q:{
            platId: null,
            jyrq:null,
            actId:null,
            batchId:null
        },
		showList: true,
		title: null,
		balBizcheckRslt: {}
	},
	methods: {
		reload: function (event) {
            layer.load();
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
                postData:{'platId': vm.q.platId,'jyrq': vm.q.jyrq,'batchId':vm.q.batchId,'whereFrom':'T0HK'},
                page:page
            }).trigger("reloadGrid");

            var page = $("#jqGrid2").jqGrid('getGridParam','page');
            $("#jqGrid2").jqGrid('setGridParam',{
                postData:{'platId': vm.q.platId,'jyrq': vm.q.jyrq,'batchId':vm.q.batchId,'whereFrom':'T0HK'},
                page:page
            }).trigger("reloadGrid");
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
        elem: '#jyrq', //指定元素
    });
    $("#platformId_query").val("PAFS00");//设置默认值
    form.render('select');
});

//表格数据转码
function respCodeFormatter(value, options, row){
    var html = '';
    if(value == 0){
        html = '平账';
    }else if(value == 1){
        html = '账不平';
    }else {
        html = '未知';
    }
    return html;
}

function checkT00(){
    var url = "../balplatformcheck/checkPlatFRslt";
    var platId = "",jyrq = "",actCode = "";
    platId = $("#platformId_query ").val();
    actCode = $("#actCodeId_query ").val();
	jyrq = $("#jyrq ").val();
	if(platId == "" || jyrq == ""){
        alert('请输入对账条件！');
        return ;
    }
    var obj = {};
    obj.jyrq = jyrq;
    obj.platId = platId;
    obj.actCode = actCode;
    $.ajax({
        type: "POST",
        url: url,
        async:false,
        data: JSON.stringify(obj),
        success: function(r){
            vm.q.batchId = r.batchId;
            if(r.code === 0){
                alert(r, function(index){
                    vm.reload();
                });
            }else{
                alert(r.msg);
            }
            vm.reload();
        }
    });
}


//表格数据转码
function kickFromFormatter(value, options, row){
    var html = '';
    if(value == 0){
        html = '自动发起';
    }else if(value == 1){
        html = '手动发起';
    }
    return html;
}

function respCodeFormatter1(value, options, row){
    var v = value;
    if(value == 1){
        v = '账不平';
    }else if (value == 0){
        v = '平账';
    }
    return v;
}

function respCodeFormatter(value, options, row){
    var v = value;
    var typee = row.batCode;
    if(typee == "JSDZ"){
        if(value == 1){
            v = '账不平';
        }else if (value == 0){
            v = '平账';
        }else if (value == 2){
            v = '无对账记录';
        }
    }else if(typee == "platFormImp"){
        if(value == 1){
            v = '导入失败';
        }else if (value == 0){
            v = '导入成功';
        }
    }
    return v;
}