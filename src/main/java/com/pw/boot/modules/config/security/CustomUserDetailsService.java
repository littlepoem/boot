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
            List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
            for (SysResourceEntity resource : resources) {
                if (resource != null && resource.getPermission()!=null) {

                    GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(resource.getPermission());
                    //1：此处将权限信息添加到 GrantedAuthority 对象中，在后面进行全权限验证时会使用GrantedAuthority 对象。
                    grantedAuthorities.add(grantedAuthority);
                }
            }
            return new User(user.getUserName(), user.getPassword(), grantedAuthorities);
        } else {
            throw new UsernameNotFoundException("admin: " + username + " do not exist!");
        }
    }
}
