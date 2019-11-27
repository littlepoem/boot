package com.pw.boot.modules.sys.service;

/**
 * @description:
 * @author: hjc
 * @create: 2019-11-27
 */
public interface SysRoleUserService {

    /**
     * 用户是否拥有某角色
     * @param userId 用户id
     * @param roleCode 角色编码
     * @return
     */
    public boolean hasRole(long userId, String roleCode);
}
