package com.pw.boot.modules.config.security;

import com.pw.boot.modules.config.security.entity.CustomUserEntity;
import com.pw.boot.modules.sys.entity.SysUserEntity;
import com.pw.boot.modules.sys.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author: hjc
 * @description:
 * @create: 2019-06-06
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private SysUserService sysUserService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        SysUserEntity sysUserEntity = sysUserService.queryByUserName(username);
        if (sysUserEntity == null) {
            throw new UsernameNotFoundException("can not found username " + username);
        }
        return new CustomUserEntity(sysUserEntity,getRoleNames(sysUserEntity));
    }

    public List<String> getRoleNames(SysUserEntity sysUserEntity){

        return null;
    }
}
