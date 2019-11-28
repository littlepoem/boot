package com.pw.boot.modules.sys.service.impl;

import com.pw.boot.modules.common.util.Result;
import com.pw.boot.modules.common.util.SequenceUtil;
import com.pw.boot.modules.sys.dao.SysRoleDao;
import com.pw.boot.modules.sys.entity.SysRoleEntity;
import com.pw.boot.modules.sys.service.SysRoleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * @description:
 * @author: hjc
 * @create: 2019-08-05
 */
@Service
@Slf4j
public class SysRoleServiceImpl implements SysRoleService {

    @Autowired
    private SysRoleDao sysRoleDao;


    /**
     * 查询角色列表
     * @param params
     * @return
     */
    public List<SysRoleEntity> queryList(Map<String, Object> params){

        return sysRoleDao.queryList(params);
    }

    /**
     * 根据角色id查找
     * @param roleId
     * @return
     */
    public SysRoleEntity queryByRoleId(long roleId){

        return sysRoleDao.queryObject(roleId);
    }

    /**
     * 根据角色编码查询
     * @param roleCode
     * @return
     */
    public SysRoleEntity queryByRoleCode(String roleCode){

        return sysRoleDao.queryByRoleCode(roleCode);
    }

    /**
     * 新增
     * @param sysRoleEntity
     * @return
     */
    public Result save(SysRoleEntity sysRoleEntity){

        long roleId = SequenceUtil.nextId();
        sysRoleEntity.setRoleId(roleId);
        int result = sysRoleDao.save(sysRoleEntity);

        log.info("save result:"+result);

        return Result.ok().put("roleId",roleId);
    }

    /**
     * 更新
     * @param sysRoleEntity
     * @return
     */
    public Result update(SysRoleEntity sysRoleEntity){

        int result = sysRoleDao.update(sysRoleEntity);

        return Result.ok("成功");
    }
}
