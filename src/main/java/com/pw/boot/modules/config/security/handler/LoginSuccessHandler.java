package com.pw.boot.modules.config.security.handler;

import com.google.gson.Gson;
import com.pw.boot.modules.common.constant.Constants;
import com.pw.boot.modules.common.util.JwtUtil;
import com.pw.boot.modules.common.util.Result;
import com.pw.boot.modules.common.util.SequenceUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * @description:
 * @author: hjc
 * @create: 2019-11-28
 */
@Component
@Slf4j
public class LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    @Value("${jwt.header}")
    private String tokenHeader;

    @Value("${jwt.expiration}")
    private Long expiration;

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     *
     * @param request
     * @param response
     * @param authentication
     * @throws ServletException
     * @throws IOException
     */
    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {

        response.setContentType("application/json;charset=utf-8");
        /*获取用户权限信息*/
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        /* 生成jwt */
        String subject = userDetails.getUsername();
        Map<String,Object> claims = new HashMap<>();
        claims.put("authorities", userDetails.getAuthorities());
        String token = jwtUtil.generateToken(subject, claims);

        /*存储redis并设置了过期时间*/
        String redisKey = Constants.RedisKey.jwt.getValue() + SequenceUtil.nextId();
        redisTemplate.boundValueOps(redisKey).set(token, expiration, TimeUnit.SECONDS);

        /*redisKey返回*/
        response.getWriter().write(new Gson().toJson(Result.ok().put(tokenHeader, redisKey)));
    }
}
