package com.pw.boot.modules.sys.service;

import com.pw.boot.modules.sys.entity.SysUserEntity;

import java.util.List;

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

    public SysUserEntity testRedis(String userName);

    public List<SysUserEntity> testRedis2(String userName);
}
