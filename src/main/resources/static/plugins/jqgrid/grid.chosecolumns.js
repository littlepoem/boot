;(function ($) {
    $.jgrid.extend({
        choseColumns: function (p) {
            p = $.extend({
                top: 0,
                left: 0,
                width: 250,
                height: 'auto',
                dataheight: 'auto',
                modal: false,
                recreateForm: false
            }, p || {});
            return this.each(function () {
                var $t = this;
                if (!$t.grid) {
                    return;
                }
                var gID = $t.p.id,
                    dtbl = "ColTbl_" + gID,
                    IDs = {
                        themodal: 'colmod' + gID,
                        modalhead: 'colhd' + gID,
                        modalcontent: 'colcnt' + gID,
                        scrollelm: dtbl
                    };
                if (p.recreateForm === true && $("#" + IDs.themodal).html() != null) {
                    $("#" + IDs.themodal).remove();
                }
                if ($("#" + IDs.themodal).html() != null) {
                    $.jgrid.viewModal("#" + IDs.themodal, {
                        gbox: "#gbox_" + gID,
                        jqm: p.jqModal,
                        jqM: false,
                        modal: p.modal
                    });
                } else {
                    var dh = isNaN(p.dataheight) ? p.dataheight : p.dataheight + "px";
                    var content = "";
                    for (i = 0; i < this.p.colNames.length; i++) {
                        if (!$t.p.colModel[i].hidedlg) {
                            content += "<input type='checkbox' id='col_" + $t.p.colModel[i].name + "' " + ($t.p.colModel[i].hidden ? "" : "checked") + " /><label for='col_" + $t.p.colModel[i].name + "'>" + $t.p.colModel[i].label + "</label><br/>";
                        }
                    }
                    content = '<div style="padding-top: 10px;padding-left: 10px; line-height: 22px; font-weight: 300;">' + content + '</div>';
                    layer.open({
                        type: 1,
                        title: '选择列',
                        shade: 0,
                        id: dtbl,
                        offset: [p.top + 10, p.left - p.width],
                        area: [p.width, dh],
                        closeBtn: 2,
                        content: content //这里content是一个普通的String
                        , btnAlign: 'l'
                        , btn: ['确定', '全选', '不选']
                        , yes: function (index, layero) {
                            for (i = 0; i < $t.p.colModel.length; i++) {
                                if (!$t.p.colModel[i].hidedlg) {
                                    var nm = $t.p.colModel[i].name.replace(/\./g, "\\.");
                                    if ($("#col_" + nm, "#" + dtbl).prop("checked")) {
                                        $($t).jqGrid("showCol", $t.p.colModel[i].name);
                                        $("#col_" + nm, "#" + dtbl).attr("defaultChecked", true);
                                    } else {
                                        $($t).jqGrid("hideCol", $t.p.colModel[i].name);
                                        $("#col_" + nm, "#" + dtbl).attr("defaultChecked", "");
                                    }
                                }
                            }
                            $($t).setGridWidth($(window).width() - 5);
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                            return false;
                        }, btn2: function (index, layero) {
                            $("#" + dtbl).find(":checkbox").prop("checked", true);
                            return false;
                        }, btn3: function (index, layero) {
                            $("#" + dtbl).find(":checkbox").prop("checked", false);
                            return false;
                        }, success: function (layero, index) {
                            var btn = layero.find('.layui-layer-btn');
                            btn.find('.layui-layer-btn0').css("padding", "0px 5px 0px 5px");
                            btn.find('.layui-layer-btn1').css("padding", "0px 5px 0px 5px");
                            btn.find('.layui-layer-btn2').css("padding", "0px 5px 0px 5px");
                            $(layero).width(200);
                        }
                    });
                }
            });
        }
    });
})(jQuery);