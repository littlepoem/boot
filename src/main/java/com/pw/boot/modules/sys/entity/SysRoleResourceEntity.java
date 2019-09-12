package com.pw.boot.modules.sys.entity;

/**
 * @description:
 * @author: hjc
 * @create: 2019-06-10
 */
public class SysRoleResourceEntity {

    private long roleId;
    private long resourceId;

    public long getRoleId() {
        return roleId;
    }

    public void setRoleId(long roleId) {
        this.roleId = roleId;
    }

    public long getResourceId() {
        return resourceId;
    }

    public void setResourceId(long resourceId) {
        this.resourceId = resourceId;
    }
}
