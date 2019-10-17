//jqGrid的配置信息
$.jgrid.defaults.width = 1000;
$.jgrid.defaults.responsive = true;
$.jgrid.defaults.styleUI = 'Bootstrap';

//工具集合Tools
window.T = {};

// 获取请求参数
// 使用示例
// location.href = http://localhost:8080/index.html?id=123
// T.p('id') --> 123;
var url = function(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
};
T.p = url;

//全局配置
$.ajaxSetup({
	dataType: "json",
	contentType: "application/json",
	cache: false
});

//选择一条记录
function getSelectedRow() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if(!rowKey){
    	alert("请选择一条记录");
    	return ;
    }
    
    var selectedIDs = grid.getGridParam("selarrrow");
    if(selectedIDs.length > 1){
    	alert("只能选择一条记录");
    	return ;
    }
    
    return selectedIDs[0];
}

//选择多条记录
function getSelectedRows() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if(!rowKey){
    	alert("请选择一条记录");
    	return ;
    }
    
    return grid.getGridParam("selarrrow");
}

/**
 *  获取zTree 节点下的所有节点
 * @param treeNode
 * @param childs
 */
function getAllNodes(treeNode, childs) {
    var childNodes = treeNode.children;
    if(childNodes){
        for (var i=0;i<childNodes.length;i++){
            childs+="," + childNodes[i].id;
            if(childNodes){
                childs=getAllNodes(childNodes[i],childs);
            }
        }
    }
    return childs;
}

//导出excel jsonWhere是JSON数据
function exportExcelByWhere(url, jsonWhere) {
    var form = $("<form>");//定义一个form表单
    form.attr("style", "display:none");
    form.attr("target", "");
    form.attr("method", "post");
    form.attr("action", url);
    $.each(jsonWhere, function (key, val) {
        var input1 = $("<input>");
        input1.attr("type", "hidden");
        input1.attr("name", key);
        input1.attr("value", val);
        form.append(input1);
    });
    $("body").append(form);//将表单放置在web中
    form.submit();//表单提交
}



