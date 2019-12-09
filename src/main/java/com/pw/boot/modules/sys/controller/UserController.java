package com.pw.boot.modules.sys.controller;

import com.pw.boot.modules.common.util.Result;
import com.pw.boot.modules.sys.entity.SysUserEntity;
import com.pw.boot.modules.sys.service.SysUserService;
import com.pw.boot.modules.sys.util.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * @description:
 * @author: hjc
 * @create: 2019-11-26
 */
@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    private SysUserService sysUserService;

    @Autowired
    private UserUtil userUtil;

    @RequestMapping(value = "info")
    @ResponseBody
    public Result info(){

        SysUserEntity user = userUtil.getCurrentUser();

        return Result.ok().put("user",user);
    }

    @RequestMapping(value = "test")
    @ResponseBody
    public Result test(){

        SysUserEntity user = sysUserService.testRedis("admin");

        return Result.ok().put("user",user);
    }

    @RequestMapping(value = "test2")
    @ResponseBody
    public Result test2(){

        List<SysUserEntity> list = sysUserService.testRedis2("admin");

        return Result.ok().put("list",list);
    }
}
