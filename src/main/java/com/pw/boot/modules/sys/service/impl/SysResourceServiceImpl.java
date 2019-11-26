package com.pw.boot.modules.sys.service.impl;

import com.pw.boot.modules.common.constant.Constants;
import com.pw.boot.modules.sys.dao.SysResourceDao;
import com.pw.boot.modules.sys.entity.SysResourceEntity;
import com.pw.boot.modules.sys.service.SysResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @description:
 * @author: hjc
 * @create: 2019-08-02
 */
@Service
public class SysResourceServiceImpl implements SysResourceService {

    @Autowired
    private SysResourceDao sysResourceDao;

    /**
     * 查询功能项权限列表 type = '3'
     * @return
     */
    public List<SysResourceEntity> queryAuthItemList(){

        return sysResourceDao.queryAuthItemList();
    }

    /**
     * 根据parentId查询子列表
     * @return
     */
    public List<SysResourceEntity> queryListByParentId(long parentId){

        return sysResourceDao.queryListByParentId(parentId);
    }

    /**
     * 根据用户id查找资源
     * @param userId
     * @return
     */
    public List<SysResourceEntity> queryListByUserId(long userId){

        return sysResourceDao.queryListByUserId(userId);
    }

    /**
     * 根据用户id查找菜单树
     * @param userId
     * @return
     */
    public List<SysResourceEntity> queryUserMenus(long userId){

        //用户所有资源项
        //todo 去除功能项
        List<SysResourceEntity> menus = queryListByUserId(userId);

        //取出资源项id
        List<Long> menuIds = menus.stream().map(SysResourceEntity::getResourceId).collect(Collectors.toList());

        //构造目录层菜单
        List<SysResourceEntity> directories = buildMenuByParentId(0, menuIds);

        //从目录层菜单开始递归构造
        List<SysResourceEntity> treeMenus = buildTreeMenus(directories, menuIds);
        return treeMenus;
    }

    /**
     * 根据上级id 和 用户拥有的资源id列表，返回下级资源列表
     * @param parentId 上级id
     * @param menuIds 用户拥有的资源id列表
     * @return
     */
    public List<SysResourceEntity> buildMenuByParentId(long parentId, List<Long> menuIds){
        //根据上级Id,查询所有下级资源
        List<SysResourceEntity> subMenus = queryListByParentId(parentId);
        List<SysResourceEntity> reMenus= new ArrayList<>();
        for (SysResourceEntity subMenu: subMenus){
            //如果下级资源在用户授权资源中,则添加
            if(menuIds.contains(subMenu.getResourceId())){
                reMenus.add(subMenu);
            }
        }
        return reMenus;
    }

    /**
     * 递归构造菜单树
     * @param resources 源菜单
     * @param menuIds 用户所有授权资源id列表
     * @return
     */
    public List<SysResourceEntity> buildTreeMenus(List<SysResourceEntity> resources, List<Long> menuIds){
        List<SysResourceEntity> treeMenus = new ArrayList<>();
        for (SysResourceEntity menu: resources){
            if(Constants.ResourceType.directory.getValue().equals(menu.getType())){
                List<SysResourceEntity> childMenus = buildMenuByParentId(menu.getResourceId(), menuIds);
                menu.setSubList(buildTreeMenus(childMenus, menuIds));
            }
            treeMenus.add(menu);
        }
        return treeMenus;
    }

}
