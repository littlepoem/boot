package com.pw.boot.modules.sys.entity;

/**
 * @author: hjc
 * @description:
 * @create: 2019-06-06
 */
public class SysRoleEntity {

    private long roleId;
    private String roleName;
    private String roleCode;
    private String description;

    public long getRoleId() {
        return roleId;
    }

    public void setRoleId(long roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleCode() {
        return roleCode;
    }

    public void setRoleCode(String roleCode) {
        this.roleCode = roleCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
