package com.pw.boot.modules.sys.dao;

import com.pw.boot.modules.base.dao.BaseDao;
import com.pw.boot.modules.sys.entity.SysResourceEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @description:
 * @author: hjc
 * @create: 2019-08-02
 */
@Mapper
public interface SysResourceDao extends BaseDao<SysResourceEntity> {

    List<SysResourceEntity> queryAllList();

    List<SysResourceEntity> queryListByUserId(@Param("userId")long userId);
}
