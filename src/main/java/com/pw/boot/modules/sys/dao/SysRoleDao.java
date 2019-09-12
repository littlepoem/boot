package com.pw.boot.modules.sys.dao;

import com.pw.boot.modules.base.dao.BaseDao;
import com.pw.boot.modules.sys.entity.SysRoleEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * @description:
 * @author: hjc
 * @create: 2019-08-05
 */
@Mapper
public interface SysRoleDao extends BaseDao<SysRoleEntity> {

    SysRoleEntity queryByRoleName(@Param("roleName")String roleName);
}
