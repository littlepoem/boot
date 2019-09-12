package com.pw.boot.modules.sys.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * @description:
 * @author: hjc
 * @create: 2019-06-05
 */
@Controller
public class IndexController {

    /**
     *
     * @return
     */
//    @RequestMapping("/")
    public ModelAndView index(){

        return new ModelAndView("index.html");
    }
}
