$(function () {
    $("#jqGrid").jqGrid({
        url: '../balholidayconfinfo/list',
        datatype: "json",
        colModel: [
            {
                label: 'holidayConfId',
                name: 'holidayConfId',
                index: 'holiday_conf_id',
                width: 50,
                key: true,
                hidden: true
            },
            {label: '日期', name: 'date', index: 'date', width: 80},
            {label: '日期类型', name: 'dateTypeName', index: 'date_type', width: 80},
            {label: '日期描述', name: 'description', index: 'description', width: 80}
        ],
        viewrecords: true,
        height: 385,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader: {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames: {
            page: "page",
            rows: "limit",
            order: "order"
        },
        gridComplete: function () {
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        showList: true,
        title: null,
        balHolidayConfInfo: {}
    },
    methods: {
        query: function () {
            vm.reload();
        },
        add: function () {
            vm.showList = false;
            vm.title = "新增";
            vm.balHolidayConfInfo = {};
        },
        update: function (event) {
            var holidayConfId = getSelectedRow();
            if (holidayConfId == null) {
                return;
            }
            vm.showList = false;
            vm.title = "修改";

            vm.getInfo(holidayConfId)
        },
        saveOrUpdate: function (event) {
            var url = vm.balHolidayConfInfo.holidayConfId == null ? "../balholidayconfinfo/save" : "../balholidayconfinfo/update";
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(vm.balHolidayConfInfo),
                success: function (r) {
                    if (r.code === 0) {
                        alert(r, function (index) {
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        del: function (event) {
            var holidayConfIds = getSelectedRows();
            if (holidayConfIds == null) {
                return;
            }

            confirm('确定要删除选中的记录？', function () {
                $.ajax({
                    type: "POST",
                    url: "../balholidayconfinfo/delete",
                    data: JSON.stringify(holidayConfIds),
                    success: function (r) {
                        if (r.code == 0) {
                            alert(r, function (index) {
                                $("#jqGrid").trigger("reloadGrid");
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        getInfo: function (holidayConfId) {
            $.get("../balholidayconfinfo/info/" + holidayConfId, function (r) {
                if (r.code == 0) {
                    vm.balHolidayConfInfo = r.balHolidayConfInfo;
                } else {
                    alert(r.msg);
                }
            });
        },
        reload: function (event) {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            $("#jqGrid").jqGrid('setGridParam', {
                page: page
            }).trigger("reloadGrid");
        }
    }
});