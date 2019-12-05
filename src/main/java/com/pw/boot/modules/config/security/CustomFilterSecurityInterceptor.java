package com.pw.boot.modules.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.SecurityMetadataSource;
import org.springframework.security.access.intercept.AbstractSecurityInterceptor;
import org.springframework.security.access.intercept.InterceptorStatusToken;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.stereotype.Service;

import javax.servlet.*;
import java.io.IOException;

/**
 * @description: 认证拦截器
 *               访问资源（即授权管理）时，会通过AbstractSecurityInterceptor拦截器拦截
 *               其中会调用FilterInvocationSecurityMetadataSource的方法来获取被拦截url所需的全部权限
 *               再调用授权管理器AccessDecisionManager，这个授权管理器会通过spring的全局缓存SecurityContextHolder获取用户的权限信息，
 *               还会获取被拦截的url和被拦截url所需的全部权限，然后根据所配的策略（有：一票决定，一票否定，少数服从多数等）判断，
 *               如果权限足够，则返回，权限不够则报错并调用权限不足页面
 * @author: hjc
 * @create: 2019-08-02
 */
@Service
public class CustomFilterSecurityInterceptor extends AbstractSecurityInterceptor implements Filter {

    /**
     * 资源与权限对应关系
     */
    @Autowired
    private FilterInvocationSecurityMetadataSource securityMetadataSource;

    @Override
    public SecurityMetadataSource obtainSecurityMetadataSource() {
        return this.securityMetadataSource;
    }

    @Autowired
    public void setMyAccessDecisionManager(CustomAccessDecisionManager customAccessDecisionManager) {
        super.setAccessDecisionManager(customAccessDecisionManager);
    }

    /**
     * 登录后 每次请求都会调用这个拦截器进行请求过滤
     * @param request
     * @param response
     * @param chain
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        FilterInvocation fi = new FilterInvocation(request, response, chain);

        //fi里面有一个被拦截的url
        //里面调用CustomFilterInvocationSecurityMetadataSource的getAttributes(Object object)这个方法获取fi对应的所有权限
        //再调用CustomAccessDecisionManager的decide方法来校验用户的权限是否足够
        InterceptorStatusToken token = super.beforeInvocation(fi);
        try {
            //执行下一个拦截器
            fi.getChain().doFilter(fi.getRequest(), fi.getResponse());
        } finally {
            super.afterInvocation(token, null);
        }
    }

    @Override
    public Class<?> getSecureObjectClass() {
        return FilterInvocation.class;
    }
}
