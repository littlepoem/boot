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
@RequestMapping("/")
public class IndexController {

    /**
     *
     * @return
     */
    @RequestMapping("/")
    public ModelAndView root(){

        return new ModelAndView("redirect:/login");
    }

    @RequestMapping("/index")
    public String index(){

        return "index.html";
    }
}
