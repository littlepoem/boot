package com.pw.boot.modules.sys.entity;

/**
 * @description:
 * @author: hjc
 * @create: 2019-06-10
 */
public class SysRoleResourceEntity {

    private Integer roleId;
    private Integer resourceId;

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public Integer getResourceId() {
        return resourceId;
    }

    public void setResourceId(Integer resourceId) {
        this.resourceId = resourceId;
    }
}
