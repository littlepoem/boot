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
    var nowDate = "";
    var batCode = "";
    if(url != "" && url != null){
        $("#back").css('display','block');
        nowDate = theRequest.nowDate;
        batCode = theRequest.typeId;
    }

        $("#jqGrid").jqGrid({
        url: '../balbatchrslt/list',
        datatype: "json",
        postData:{'date':nowDate,'batCode': batCode},
        colModel: [
            { label: 'batchRsltId', name: 'batchRsltId', index: 'batch_rslt_id', width: 50, key: true,hidden:true },
			{ label: '批次号', name: 'batId', index: 'bat_id', width: 120 },
			{ label: '调度日期', name: 'schedDate', index: 'sched_date', width: 80 },
            { label: '开始时间', name: 'batTimeStart', index: 'bat_time_start', width: 80,hidden:true  },
			{ label: '结束时间', name: 'batTimeEnd', index: 'bat_time_end', width: 80,hidden:true  },
			{ label: '操作代码', name: 'batCode', index: 'bat_code', width: 80,hidden:true },
			{ label: '操作名称', name: 'batName', index: 'bat_name', width: 80 }, 			
			{ label: '银行代码', name: 'bankId', index: 'bank_id', width: 80 ,hidden:true },
			{ label: '金服平台代码', name: 'platId', index: 'plat_id', width: 80 }, 			
			{ label: '成功记录数', name: 'numSucc', index: 'num_succ', width: 50 },
			{ label: '失败记录数', name: 'numFail', index: 'num_fail', width: 50 },
			{ label: '执行结果代码', name: 'respCode', index: 'resp_code', width: 80,formatter: respCodeFormatter },
			{ label: '执行结果描述', name: 'respMsg', index: 'resp_msg', width: 180 },
			{ label: '发起方式', name: 'kickFrom', index: 'kick_from', width: 80,formatter: kickFromFormatter },
			{ label: '文件名', name: 'fileName', index: 'file_name', width: 80, formatter: fileNameFormatter},
			{ label: '文件大小', name: 'fileSize', index: 'file_size', width: 80 }, 			
			{ label: '记录更新日期', name: 'tsLastUpdate', index: 'ts_last_update', width: 100  }
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
        q:{
            batCode: null,
            kickFrom: null
        },
		showList: true,
		title: null,
		balBatchRslt: {},
        batCodeOptions:{}
	},
    created:function(){
        var url ="../balbatchrslt/getCodeInfo";
        $.post(url,function (r) {//初始化字典
            if(r.code == 0){
                vm.batCodeOptions = r.codes.batCodeCodes;
            }else {
            }
        });

    },
	methods: {
		query: function () {
			vm.reload();
		},
        back: function (event) {
            history.go(-1);
        },
        reset: function(){
            vm.q.batCode = null;
            vm.q.kickFrom = null;
            $("#qbatCode").val("");
            $("#scheduleDate").val("");
        },
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.balBatchRslt = {};
		},
		update: function (event) {
			var batId = getSelectedRow();
			if(batId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(batId)
		},
		saveOrUpdate: function (event) {
			var url = vm.balBatchRslt.batId == null ? "../balbatchrslt/save" : "../balbatchrslt/update";
			$.ajax({
				type: "POST",
			    url: url,
			    data: JSON.stringify(vm.balBatchRslt),
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
			var batIds = getSelectedRows();
			if(batIds == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: "../balbatchrslt/delete",
				    data: JSON.stringify(batIds),
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
		getInfo: function(batId){
			$.get("../balbatchrslt/info/"+batId, function(r){
                if(r.code == 0){
                    vm.balBatchRslt = r.balBatchRslt;
                }else{
                    alert(r.msg);
                }
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = 1;
            var date = $("#scheduleDate").val();
            date = date.replace(/-/g,"");
			$("#jqGrid").jqGrid('setGridParam',{
                postData:{'batCode': vm.q.batCode,'kickFrom': vm.q.kickFrom,'date':date},
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

function respCodeFormatter(value, options, row){
    var v = value;
    var typee = row.batCode;
    if(typee == "jsdz"){
        if(value == 1){
            v = '账不平';
        }else if (value == 0){
            v = '平账';
        }else if (value == 2){
            v = '无对账记录';
        }
	}else {
        if(value == 1){
            v = '操作失败';
        }else if (value == 0){
            v = '操作成功';
        }
	}

    return v;
}

function fileNameFormatter(value, options, row){
    if(value == null){
        value = "";
    }
    var v = value;
    var fileName = row.fileName;
    var schedDate = row.schedDate;
    var kickFrom = row.kickFrom;
    var schedDate = row.schedDate;
    var batId = row.batId;
    if(kickFrom == "1" && value != ""){
        v = "<a style='color:blueviolet !important;text-decoration: underline' href='../balbatchrslt/downloadFile?fileName="+value+"&schedDate="+schedDate+"&batId="+batId+"'>"+value+"</a>";
    }
    return v;
}


function batCodeChange() {
    var selVal = $("#qbatCode").val();
    vm.q.batCode = selVal;
}

layui.use('laydate', function(){
    var laydate = layui.laydate;

    //执行一个laydate实例
    laydate.render({
        elem: '#scheduleDate', //指定元素
    });


});

function downloadFile(){
    window.location.href="../balbatchrslt/downloadFile";
}


