package com.pw.boot.modules.sys.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author: hjc
 * @description: 通用页面跳转
 * @create: 2019-06-06
 */
@Controller
public class SysPageController {

    @RequestMapping("{module}/{url}.html")
    public String page(@PathVariable("module") String module, @PathVariable("url") String url){

        return module + "/" + url + ".html";
    }
}
