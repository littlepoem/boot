package com.pw.boot.modules.sys.controller;

import com.pw.boot.modules.common.util.Result;
import com.pw.boot.modules.sys.entity.SysResourceEntity;
import com.pw.boot.modules.sys.service.SysResourceService;
import com.pw.boot.modules.sys.util.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * @description:
 * @author: hjc
 * @create: 2019-11-25
 */
@Controller
@RequestMapping("/menu")
public class MenuController {

    @Autowired
    private UserUtil userUtil;

    @Autowired
    private SysResourceService sysResourceService;


    /**
     * 查找用户菜单树
     * @return
     */
    @RequestMapping(value = "/userMenus")
    @ResponseBody
    public Result userMenus(){

        long userId = userUtil.getCurrentUserId();

        List<SysResourceEntity> menuList = sysResourceService.queryUserMenus(userId);

        return Result.ok().put("menuList",menuList);
    }

}
