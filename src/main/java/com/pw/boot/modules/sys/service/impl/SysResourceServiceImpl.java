package com.pw.boot.modules.sys.service.impl;

import com.pw.boot.modules.sys.dao.SysResourceDao;
import com.pw.boot.modules.sys.entity.SysResourceEntity;
import com.pw.boot.modules.sys.service.SysResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
     * 查询
     * @return
     */
    public List<SysResourceEntity> queryAllList(){

        return sysResourceDao.queryAllList();
    }

    /**
     * 根据用户id查找资源
     * @param userId
     * @return
     */
    public List<SysResourceEntity> queryListByUserId(long userId){

        return sysResourceDao.queryListByUserId(userId);
    }
}
