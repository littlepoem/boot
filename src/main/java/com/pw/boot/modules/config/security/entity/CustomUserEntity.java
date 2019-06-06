package com.pw.boot.modules.config.security.entity;

import com.pw.boot.modules.sys.entity.SysUserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @description:
 * @author: hjc
 * @create: 2019-06-06
 */
public class CustomUserEntity implements UserDetails {

    private SysUserEntity sysUserEntity;

    private List<String> roleNames;

    public CustomUserEntity(SysUserEntity sysUserEntity,List<String> roleNames){
        this.sysUserEntity = sysUserEntity;
        this.roleNames = roleNames;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return roleNames.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return sysUserEntity.getPassword();
    }

    @Override
    public String getUsername() {
        return sysUserEntity.getUserName();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
