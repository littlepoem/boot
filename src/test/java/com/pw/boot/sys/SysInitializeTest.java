package com.pw.boot.sys;

import com.pw.boot.modules.common.util.BCryptUtil;
import com.pw.boot.modules.common.util.SequenceUtil;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * @description:
 * @author: hjc
 * @create: 2019-09-16
 */
@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest
public class SysInitializeTest {


    @Test
    public void sequence(){

        log.info("sequence:"+SequenceUtil.nextId());
    }

    @Test
    public void password(){

        log.info("password:"+ BCryptUtil.encrypt("admin"));
    }
}
