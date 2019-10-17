$(function () {
    $("#jqGrid").jqGrid({
        url: '../balinfRulesEntity/list',
        datatype: "json",
        colModel: [
            { label: 'ruleId', name: 'ruleId', index: 'rule_id', width: 40, key: true },
            { label: '规则名称', name: 'ruleName', index: 'rule_name', width: 120 },
            { label: '准确度', name: 'accuracy', index: 'accuracy', width: 50 },
            { label: '规则描述', name: 'ruleDesc', index: 'rule_desc', width: 120 },
            { label: '是否有效', name: 'effect', index: 'effect', width: 50 },
            { label: '发起侧', name: 'kickoff', index: 'kickoff', width: 50 },
            { label: '账户侧检索条件', name: 'whereBank', index: 'where_bank', width: 100 },
            { label: '交易侧检索条件', name: 'whereBiz', index: 'where_biz', width: 100 },
            { label: '交易侧检索粒度', name: 'granule', index: 'granule', width: 50 },
            { label: '处理引擎', name: 'engineName', index: 'engine_name', width: 100 },
            { label: '引擎参数', name: 'engineParam', index: 'engine_param', width: 80 },
            { label: '记录更新日期', name: 'updateTime', index: 'update_time', width: 80 }
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
        balinfRulesEntity: {}
    },
    methods: {
        query: function () {
            vm.reload();
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.balinfRulesEntity = {};
        },
        update: function (event) {
            var ruleId = getSelectedRow();
            if(ruleId == null){
                return ;
            }
            vm.showList = false;
            vm.title = "修改";

            vm.getInfo(ruleId)
        },
        saveOrUpdate: function (event) {
            var url = vm.balinfRulesEntity.ruleId == null ? "../balinfRulesEntity/save" : "../balinfRulesEntity/update";
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(vm.balinfRulesEntity),
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
            var ruleIds = getSelectedRows();
            if (ruleIds.length <= 0) {
                alert("请选择一条记录！");
                return;
            }
            if (ruleIds.length > 1) {
                alert("请逐条删除！");
                return;
            }
            var param = {
                ruleId: ruleIds[0]
            };

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: "../balinfRulesEntity/delete",
                    data: JSON.stringify(param),
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
        getInfo: function(ruleId){
            $.get("../balinfRulesEntity/info/"+ruleId, function(r){
                if(r.code == 0){
                    vm.balinfRulesEntity = r.balinfRulesEntity;
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