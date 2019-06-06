package com.pw.boot.modules.sys.dao;

import com.pw.boot.modules.base.dao.BaseDao;
import com.pw.boot.modules.sys.entity.SysUserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * @description:
 * @author: hjc
 * @create: 2019-06-06
 */
@Mapper
public interface SysUserDao extends BaseDao<SysUserEntity> {

    SysUserEntity queryByUserName(@Param("userName")String userName);
}
