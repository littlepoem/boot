package com.pw.boot.modules.config.security;

import com.pw.boot.modules.sys.entity.SysResourceEntity;
import com.pw.boot.modules.sys.entity.SysUserEntity;
import com.pw.boot.modules.sys.service.SysResourceService;
import com.pw.boot.modules.sys.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    @Autowired
    private SysResourceService sysResourceService;


    @Override
    public UserDetails loadUserByUsername(String username) {

        SysUserEntity user = sysUserService.queryByUserName(username);
        if (user != null) {
            List<SysResourceEntity> resources = sysResourceService.queryListByUserId(user.getUserId());
            /**
             * grantedAuthorities 存放用户具备的权限
              */
            List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
            for (SysResourceEntity resource : resources) {
                if (resource != null && resource.getPermission()!=null) {

                    GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(resource.getPermission());
                    grantedAuthorities.add(grantedAuthority);
                }
            }
            return new User(user.getUserName(), user.getPassword(), grantedAuthorities);
        } else {
            throw new UsernameNotFoundException("user: " + username + " do not exist!");
        }
    }
}
