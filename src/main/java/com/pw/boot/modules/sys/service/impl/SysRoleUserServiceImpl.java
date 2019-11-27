package com.pw.boot.modules.sys.service.impl;

import com.pw.boot.modules.sys.dao.SysRoleUserDao;
import com.pw.boot.modules.sys.entity.SysRoleUserEntity;
import com.pw.boot.modules.sys.service.SysRoleUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @description:
 * @author: hjc
 * @create: 2019-11-27
 */
@Service
@Slf4j
public class SysRoleUserServiceImpl implements SysRoleUserService {

    @Autowired
    private SysRoleUserDao sysRoleUserDao;

    /**
     * 用户是否拥有某角色
     * @param userId 用户id
     * @param roleCode 角色编码
     * @return
     */
    public boolean hasRole(long userId, String roleCode){

        return (sysRoleUserDao.queryByUserIdAndRoleCode(userId, roleCode)) != null;
    }

}
