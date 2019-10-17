/**
 * Created by PoemWhite on 2019/4/16.
 */

var vm = new Vue({
    el:'#rrapp',
    data:{
        balinfRules:{}
    },
    created:function(){
        var url ="../balinfrules/getRules";
        $.post(url,function (r) {//初始化规则下拉框
            if(r.code == 0){
                vm.balinfRules = r.codes.balinfRules;
            }else {
            }
        });

    },
    methods: {
        reconBankbook: function () {

            var beginDate = $("#beginDate").val();
            var endDate = $("#endDate").val();
            var ruleId = $("#ruleId").val();

            var data = {
                beginDate: beginDate,
                endDate: endDate,
                ruleId: ruleId
            };
            layer.load();
            var url = "../reconbankbook/reconBankbook";
            $.ajax({
                type: "POST",
                data: JSON.stringify(data),
                url: url,
                success: function (r) {
                    layer.closeAll('loading');
                    if (r.code == 0) {
                        alert(r.msg);
                    } else {
                        alert(r.msg);
                    }
                }
            });

        },
        refreshBankbookCache: function(){
            layer.load();
            var url = "../reconbankbook/refreshBankbookCache";
            $.ajax({
                type: "POST",
                data: {},
                url: url,
                success: function (r) {
                    layer.closeAll('loading');
                    if (r.code == 0) {
                        alert(r.msg);
                    } else {
                        alert(r.msg);
                    }
                }
            });
        }
    }
});

layui.use('laydate', function () {
    var laydate = layui.laydate;
    //执行一个laydate实例
    laydate.render({
        elem: "#beginDate",
        format: "yyyyMMdd"
    });
    laydate.render({
        elem: "#endDate",
        format: "yyyyMMdd"
    });
});