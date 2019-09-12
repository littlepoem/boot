package com.pw.boot.sys;

import com.pw.boot.modules.common.util.SequenceUtil;
import com.pw.boot.modules.common.util.wrapper.Wrapper;
import com.pw.boot.modules.sys.entity.SysRoleEntity;
import com.pw.boot.modules.sys.service.SysRoleService;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @description:
 * @author: hjc
 * @create: 2019-08-05
 */
@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest
public class SysRoleTest {

    @Autowired
    private SysRoleService sysRoleService;

    @Test
    public void addRole(){

        SysRoleEntity admin = new SysRoleEntity();
        admin.setRoleId(SequenceUtil.nextId());
        admin.setRoleName("ROLE_ADMIN");
        admin.setNickname("管理员");
        admin.setDescription("管理员");

        Wrapper<Long> wrapper = sysRoleService.save(admin);
        log.info(wrapper.toString());
    }

    public void updRole(){

        Map<String, Object> params = new HashMap<>();
        List<SysRoleEntity> roleList = sysRoleService.queryList(params);
        if(roleList!=null && roleList.size()>0){
            SysRoleEntity role = roleList.get(0);
            role.setDescription("更新测试");

            Wrapper<String> wrapper = sysRoleService.update(role);
            log.info(wrapper.toString());
        }
    }

}
