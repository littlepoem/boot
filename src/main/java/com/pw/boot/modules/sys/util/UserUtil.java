package com.pw.boot.modules.sys.util;

import com.pw.boot.modules.sys.entity.SysUserEntity;
import com.pw.boot.modules.sys.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

/**
 * @description:
 * @author: hjc
 * @create: 2019-11-25
 */
@Component
public class UserUtil {

    @Autowired
    private SysUserService sysUserService;

    /**
     * 获取当前登录用户的userName
     * @return
     */
    public String getCurrentUserName(){

        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    /**
     * 获取当前登录用户信息
     * @return
     */
    public SysUserEntity getCurrentUser(){

        String userName = getCurrentUserName();

        SysUserEntity user = sysUserService.queryByUserName(userName);
        if(user!=null){
            return user;
        }
        throw new UsernameNotFoundException("user: " + userName + " do not exist!");
    }

    /**
     * 获取当前登录用户的userId
     * @return
     */
    public long getCurrentUserId(){

        return getCurrentUser().getUserId();
    }
}
