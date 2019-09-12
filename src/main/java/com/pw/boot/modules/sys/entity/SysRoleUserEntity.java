package com.pw.boot.modules.sys.entity;

/**
 * @description:
 * @author: hjc
 * @create: 2019-06-10
 */
public class SysRoleUserEntity {

    private long userId;
    private long roleId;

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getRoleId() {
        return roleId;
    }

    public void setRoleId(long roleId) {
        this.roleId = roleId;
    }
}
