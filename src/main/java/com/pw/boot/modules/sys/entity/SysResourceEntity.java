package com.pw.boot.modules.sys.entity;

import java.util.List;

/**
 * @description:
 * @author: hjc
 * @create: 2019-06-10
 */
public class SysResourceEntity {

    private long resourceId;
    private long parentId;
    private String name;
    private String url;
    private String icon;
    private Integer sort;
    private String permission;
    private String remark;
    private String type;

    private List subList;//子列表

    public long getResourceId() {
        return resourceId;
    }

    public void setResourceId(long resourceId) {
        this.resourceId = resourceId;
    }

    public long getParentId() {
        return parentId;
    }

    public void setParentId(long parentId) {
        this.parentId = parentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List getSubList() {
        return subList;
    }

    public void setSubList(List subList) {
        this.subList = subList;
    }
}
