package com.pw.boot.modules.sys.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * @description:
 * @author: hjc
 * @create: 2019-08-05
 */
@Controller
public class HomeController {

    @RequestMapping("/")
    public ModelAndView index(Model model){

        return new ModelAndView("home.html");
    }

    @RequestMapping("/admin")
    @ResponseBody
    public String hello(){
        return "hello admin";
    }
}
