package com.pw.boot.modules.sys.service.impl;

import com.pw.boot.modules.sys.dao.SysUserDao;
import com.pw.boot.modules.sys.entity.SysUserEntity;
import com.pw.boot.modules.sys.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @description:
 * @author: hjc
 * @create: 2019-06-06
 */
@Service
public class SysUserServiceImpl implements SysUserService {

    @Autowired
    private SysUserDao sysUserDao;

    /**
     * 根据userName查找用户
     * @param userName
     * @return
     */
    public SysUserEntity queryByUserName(String userName){

        return sysUserDao.queryByUserName(userName);
    }
}
