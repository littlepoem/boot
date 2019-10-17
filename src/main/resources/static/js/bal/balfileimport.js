var vm = new Vue({
    el:'#rrapp',
    data:{

    },
    methods: {
    }
});
//////////////////////////手动新增区域//////////////////////////////////////
layui.use(['laydate','upload'], function(){
    var laydate = layui.laydate,
        upload = layui.upload;

    //执行一个laydate实例
    laydate.render({
        elem: '#jyrq', //指定元素
    });
    laydate.render({
        elem: '#gxrq', //指定元素
        type: 'time' //指定元素
    });
    laydate.render({
        elem: '#jysj', //指定元素
        type: 'datetime'
    });
    //执行实例
    var bankbook =  //选完文件后不自动上传
        upload.render({
            elem: '#bankbookUploadInput'
            ,url: '../fileUpload/importFileByType'
            ,accept: 'file' //允许上传的文件类型
            ,method:'post'
            ,exts:'xls|xlsx|bnk|txt'
            ,auto:false
            ,data:{'fileType':'bankBook'}
            ,bindAction: '#bankbookUploadBtn'
            ,choose:function (obj) {
                obj.preview(function(index, file, result){
                    var fileName = file.name;
                    $("#bankbookUploadBtn").next().text(fileName);
                    $("#bankbookUploadBtn").attr("disabled",false);
                });
            }
            ,before: function(obj){
                layer.load(); //上传loading
            }
            ,done: function(res){
                layer.closeAll('loading'); //关闭loading
                $("#importResultId").val(res.respmsg);
                alert(res.status);
                $("#bankbookUploadBtn").next().text("");
                $("#bankbookUploadBtn").attr("disabled",true);
            }
            ,error: function(index, upload){
                alert(res.status);
                layer.closeAll('loading'); //关闭loading
            }
        });
    var platform =  //选完文件后不自动上传
        upload.render({
            elem: '#platformUploadInput'
            ,url: '../fileUpload/importFileByType'
            ,accept: 'file' //允许上传的文件类型
            ,method:'post'
            ,exts:'bizdata'
            ,data:{'fileType':'jfPlatForm'}
            ,auto:false
            ,bindAction: '#platformUploadBtn'
            ,choose:function (obj) {
                obj.preview(function(index, file, result){
                    var fileName = file.name;
                    $("#platformUploadBtn").next().text(fileName);
                    $("#platformUploadBtn").attr("disabled",false);
                });
            }
            ,before:function (obj) {
                layer.load(); //上传loading
            }
            ,done: function(res){
                layer.closeAll('loading'); //关闭loading
                $("#importResultId").val(res.respmsg);
                alert(res.status);
                $("#platformUploadBtn").next().text("");
                $("#platformUploadBtn").attr("disabled",true);
            }
            ,error: function(index, upload){
                alert(res.status);
                layer.closeAll('loading'); //关闭loading
            }
        });

    var zgs =  //选完文件后不自动上传
        upload.render({
            elem: '#zgsUploadInput'
            ,url: '../fileUpload/importFileByType'
            ,accept: 'file' //允许上传的文件类型
            ,method:'post'
            ,data:{'fileType':'zgs'}
            ,auto:false
            ,bindAction: '#zgsUploadBtn'
            ,choose:function (obj) {
                obj.preview(function(index, file, result){
                    var fileName = file.name;
                    $("#zgsUploadBtn").next().text(fileName);
                    $("#zgsUploadBtn").attr("disabled",false);
                });
            }
            ,before:function (obj) {
                layer.load(); //上传loading
            }
            ,done: function(res){
                layer.closeAll('loading'); //关闭loading
                $("#importResultId").val(res.respmsg);
                alert(res.status);
                $("#zgsUploadBtn").next().text("");
                $("#zgsUploadBtn").attr("disabled",true);

            }
            ,error: function(index, upload){
                alert(res.status);
                layer.closeAll('loading'); //关闭loading
            }
        });

    var reconasso =  //选完文件后不自动上传
        upload.render({
            elem: '#assoUploadInput'
            ,url: '../fileUpload/importFileByType'
            ,accept: 'file' //允许上传的文件类型
            ,method:'post'
            ,exts:'txt'
            ,data:{'fileType':'reconasso'}
            ,auto:false
            ,bindAction: '#assoUploadBtn'
            ,choose:function (obj) {
                obj.preview(function(index, file, result){
                    var fileName = file.name;
                    $("#assoUploadBtn").next().text(fileName);
                    $("#assoUploadBtn").attr("disabled",false);
                });
            }
            ,before:function (obj) {
                layer.load(); //上传loading
            }
            ,done: function(res){
                layer.closeAll('loading'); //关闭loading
                $("#importResultId").val(res.respmsg);
                alert(res.status);
                $("#assoUploadBtn").next().text("");
                $("#assoUploadBtn").attr("disabled",true);
            }
            ,error: function(index, upload){
                alert(res.status);
                layer.closeAll('loading'); //关闭loading
            }
        });

    //多文件上传
    //多文件列表示例
    var demoListView = $('#listBodyId')
        ,uploadListIns = upload.render({
        elem: '#listFileId'
        ,url: '../fileUpload/importMultFileByType2'
        ,accept: 'file' //允许上传的文件类型
        ,method:'post'
        ,exts:'xls|xlsx'
        ,data:{'fileType':'bankBookMult'}
        ,multiple: true
        ,auto: false
        ,bindAction: '#listAction'
        ,before: function(obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。

            layer.load(); //上传loading
            this.data={'storeId': '12','storeName':'23'};
        }
        ,choose: function(obj){
            var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function(index, file, result){
                var tr = $(['<tr id="upload-'+ index +'">'
                    ,'<td>'+ file.name +'</td>'
                    ,'<td>'+ (file.size/1014).toFixed(1) +'kb</td>'
                    ,'<td>等待上传</td>'
                    ,'<td>'
                    ,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
                    ,'<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                    ,'</td>'
                    ,'</tr>'].join(''));

                //单个重传
                tr.find('.demo-reload').on('click', function(){
                    obj.upload(index, file);
                });

                //删除
                tr.find('.demo-delete').on('click', function(){
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                });

                demoListView.append(tr);
            });
        }
        ,done: function(res, index, upload){
            console.log(res);
            if(res.code == 0){ //上传成功
                var tr = demoListView.find('tr#upload-'+ index)
                    ,tds = tr.children();
                tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                tds.eq(3).html(''); //清空操作
                layer.closeAll('loading'); //关闭loading
                return delete this.files[index]; //删除文件队列已经上传成功的文件
            }
            this.error(index, upload);
            layer.closeAll('loading'); //关闭loading
        }
        ,error: function(index, upload){
            var tr = demoListView.find('tr#upload-'+ index)
                ,tds = tr.children();
            tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
            tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
            layer.closeAll('loading'); //关闭loading
        }
    });

});

/////////////流水文件导入///////////////
/*
function importFile(importType) {
    if (checkData(importType)) {
        var formData = new FormData();
        var upFile = document.getElementById(importType).files[0]
        formData.append("upfile", upFile);
        var url = "";
        if(importType == "bankbookUploadInput"){
            url = "../balbankbooklog/readExcel";
        }else if(importType == "zgsUploadInput"){
            url = "../balbizdatalog/readExcel";
        }else if(importType == "platformUploadInput"){
            url = "../balbizdatalog/readPlatformInfo";
        }else if(importType == "assoUploadInput"){
            url = "../balreconassolog/readExcel";
        }
            $.ajax({
            url: url,
            type: "post",
            data: formData,
            contentType: false,
            processData: false,

            success: function (data) {
                alert(data.status);
                $("#importResultId").val(data.respmsg);
                //清空导入文件
                var file = $("#"+importType) ;
                file.after(file.clone().val(""));
                file.remove();
            },
        });
    }
}
//JS校验form表单信息
function checkData(importType) {
    var fileDir = $("#"+importType).val();
    var suffix = fileDir.substr(fileDir.lastIndexOf("."));
    if ("" == fileDir) {
        alert("选择需要导入的Excel文件！");
        return false;
    }
    if(importType == "bankbookUploadInput"){
        if (".xls" != suffix && ".xlsx" != suffix) {
            alert("选择Excel格式的文件导入！");
            return false;
        }
    }else if(importType == "zgsUploadInput"){

    }else if(importType == "platformUploadInput"){
        if (".bizdata" != suffix) {
            alert("选择正确格式的文件导入！");
            return false;
        }
    }else if(importType == "assoUploadInput"){
        if (".txt" != suffix && ".txt" != suffix) {
            alert("选择txt格式的文件导入！");
            return false;
        }
    }
    return true;
}*/
