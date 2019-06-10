package com.pw.boot.modules.sys.entity;

/**
 * @description:
 * @author: hjc
 * @create: 2019-06-10
 */
public class SysUserRoleEntity {

    private Integer userId;
    private Integer roleId;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }
}
