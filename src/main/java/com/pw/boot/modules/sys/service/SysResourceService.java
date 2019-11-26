package com.pw.boot.modules.sys.service;

import com.pw.boot.modules.sys.entity.SysResourceEntity;

import java.util.List;

/**
 * @description:
 * @author: hjc
 * @create: 2019-08-02
 */
public interface SysResourceService {

    /**
     * 查询功能项权限列表
     * @return
     */
    public List<SysResourceEntity> queryAuthItemList();

    /**
     * 根据parentId查询子列表
     * @return
     */
    public List<SysResourceEntity> queryListByParentId(long parentId);

    /**
     * 根据用户id查找资源
     * @param userId
     * @return
     */
    public List<SysResourceEntity> queryListByUserId(long userId);

    /**
     * 根据用户id查找菜单树
     * @param userId
     * @return
     */
    public List<SysResourceEntity> queryUserMenus(long userId);
}
