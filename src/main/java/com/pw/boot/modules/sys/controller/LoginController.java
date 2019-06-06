package com.pw.boot.modules.sys.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author: hjc
 * @description:
 * @create: 2019-06-06
 */
@Controller
public class LoginController {

    @RequestMapping("/login")
    public String login(){

        return "login.html";
    }
}
