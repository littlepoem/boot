package com.pw.boot.modules.sys.service;

import com.pw.boot.modules.sys.entity.SysUserEntity;

/**
 * @description:
 * @author: hjc
 * @create: 2019-06-06
 */
public interface SysUserService {

    /**
     * 根据userName查找用户
     * @param userName
     * @return
     */
    public SysUserEntity queryByUserName(String userName);
}
