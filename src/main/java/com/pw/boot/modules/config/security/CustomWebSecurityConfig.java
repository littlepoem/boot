package com.pw.boot.modules.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;

/**
 * @author: hjc
 * @description:
 * @create: 2019-06-06
 */
@Configuration
@EnableWebSecurity
public class CustomWebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private CustomFilterSecurityInterceptor customFilterSecurityInterceptor;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private CustomAccessDeniedHandler customAccessDeniedHandler;


    /**
     * 配置认证服务
     * @param authenticationManagerBuilder 生成 AuthenticationManager
     * @throws Exception
     */
    @Override
    protected void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {

        authenticationManagerBuilder
                .userDetailsService(customUserDetailsService)
                .passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder(){

        return new BCryptPasswordEncoder();
    }

    /**
     * 配置拦截器
     * @param httpSecurity
     * @throws Exception
     */
    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        //允许iframe
        httpSecurity.headers().frameOptions().disable();
        //关闭csrf保护
        httpSecurity.csrf().disable();

        httpSecurity
                .authorizeRequests()
                .antMatchers(
                        "/",
                        "/css/**",
                        "/fonts/**",
                        "/images/**",
                        "/js/**",
                        "/plugins/**",
                        "/swagger/**",
                        "/login/captcha").permitAll()
                .anyRequest().authenticated()
                .and().formLogin()
                    .loginPage("/login").failureUrl("/login?error").permitAll()
//                    .failureForwardUrl("/?error=true")
                    .defaultSuccessUrl("/index")
                .and().logout().permitAll()
                .and().exceptionHandling().accessDeniedHandler(customAccessDeniedHandler);

        httpSecurity.addFilterBefore(customFilterSecurityInterceptor, FilterSecurityInterceptor.class);
    }
}
