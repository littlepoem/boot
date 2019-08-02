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
     * 查询
     * @return
     */
    public List<SysResourceEntity> queryAllList();

    /**
     * 根据用户id查找资源
     * @param userId
     * @return
     */
    public List<SysResourceEntity> queryListByUserId(long userId);
}
