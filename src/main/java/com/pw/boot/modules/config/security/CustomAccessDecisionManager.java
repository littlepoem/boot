package com.pw.boot.modules.config.security;

import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Iterator;

/**
 * @description:
 * @author: hjc
 * @create: 2019-08-02
 */
@Service
public class CustomAccessDecisionManager implements AccessDecisionManager {


    /**
     * CustomFilterInvocationSecurityMetadataSource 放行的请求
     * decide方法决定该权限是否有权限访问该资源
     * @param authentication 当前用户的对应权限，如果没登陆就为游客。CustomUserService中循环添加到 GrantedAuthority 对象中的权限信息集合
     * @param object 资源的地址。客户端发起的请求的requset信息
     * @param configAttributes 为CustomFilterInvocationSecurityMetadataSource的getAttributes(Object object)这个方法返回的结果
     * @throws AccessDeniedException
     * @throws InsufficientAuthenticationException
     */
    @Override
    public void decide(Authentication authentication, Object object, Collection<ConfigAttribute> configAttributes)
            throws AccessDeniedException, InsufficientAuthenticationException {

        if(null== configAttributes || configAttributes.size() <=0) {
            return;
        }
        ConfigAttribute c;
        String needRole;
        for(Iterator<ConfigAttribute> iter = configAttributes.iterator(); iter.hasNext(); ) {
            c = iter.next();
            needRole = c.getAttribute();
            for(GrantedAuthority ga : authentication.getAuthorities()) {
                if(needRole.trim().equals(ga.getAuthority())) {
                    return;
                }
            }
        }
        throw new AccessDeniedException("no right");
    }

    @Override
    public boolean supports(ConfigAttribute attribute) {
        return true;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return true;
    }
}
