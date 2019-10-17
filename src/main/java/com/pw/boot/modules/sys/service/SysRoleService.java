package com.pw.boot.modules.sys.service;

import com.pw.boot.modules.common.util.wrapper.Wrapper;
import com.pw.boot.modules.sys.entity.SysRoleEntity;

import java.util.List;
import java.util.Map;

/**
 * @description:
 * @author: hjc
 * @create: 2019-08-05
 */
public interface SysRoleService {

    /**
     * 查询角色列表
     * @param params
     * @return
     */
    public List<SysRoleEntity> queryList(Map<String, Object> params);

    /**
     * 根据角色id查找
     * @param roleId
     * @return
     */
    public SysRoleEntity queryByRoleId(long roleId);

    /**
     * 根据角色编码查询
     * @param roleCode
     * @return
     */
    public SysRoleEntity queryByRoleCode(String roleCode);

    /**
     * 新增
     * @param sysRoleEntity
     * @return
     */
    public Wrapper<Long> save(SysRoleEntity sysRoleEntity);

    /**
     * 更新
     * @param sysRoleEntity
     * @return
     */
    public Wrapper<String> update(SysRoleEntity sysRoleEntity);
}
