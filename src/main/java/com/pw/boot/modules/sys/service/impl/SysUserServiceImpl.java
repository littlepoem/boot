package com.pw.boot.modules.sys.service.impl;

import com.pw.boot.modules.sys.dao.SysUserDao;
import com.pw.boot.modules.sys.entity.SysUserEntity;
import com.pw.boot.modules.sys.service.SysUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @description:
 * @author: hjc
 * @create: 2019-06-06
 */
@Service
@Slf4j
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

    @Cacheable(value = "usercache", key = "#p0")
    public SysUserEntity testRedis(String userName){
        log.debug("db data");
        return sysUserDao.queryByUserName(userName);
    }

    @Cacheable(value = "usercache2", key = "#p0")
    public List<SysUserEntity> testRedis2(String userName){
        log.debug("db data2");

        List<SysUserEntity> list = new ArrayList<>();

        list.add(sysUserDao.queryByUserName(userName));

        return list;
    }
}
