package com.pw.boot.modules.sys.dao;

import com.pw.boot.modules.base.dao.BaseDao;
import com.pw.boot.modules.sys.entity.SysRoleUserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * @description:
 * @author: hjc
 * @create: 2019-06-10
 */
@Mapper
public interface SysRoleUserDao extends BaseDao<SysRoleUserEntity> {

    @Select("select t1.* from sys_role_user t1 left join sys_role t2 on t2.role_id = t1.role_id " +
            " where t1.user_id = 1304297583149088 and t2.role_code = 'ROLE_ADMIN' limit 1")
    SysRoleUserEntity queryByUserIdAndRoleCode(@Param("userId")long userId, @Param("roleCode")String roleCode);

}
