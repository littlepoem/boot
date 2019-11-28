package com.pw.boot.modules.config.filter;

import com.google.gson.Gson;
import com.pw.boot.modules.common.exception.ImageCodeException;
import com.pw.boot.modules.common.util.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @description:
 * @author: hjc
 * @create: 2019-11-27
 */
@Slf4j
@Component
public class ImageCodeFilter extends OncePerRequestFilter implements InitializingBean {


    @Autowired
    private RedisTemplate redisTemplate;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        if("/login".equals(request.getRequestURI())
            && request.getMethod().equalsIgnoreCase("post")){

            try {
                /*图片验证码是否正确*/
                checkImageCode(request);
            }catch (ImageCodeException e){
                response.setContentType("application/json;charset=utf-8");
                response.getWriter().write(new Gson().toJson(
                        Result.error(e.getMessage())
                ));
                return;
            }
        }
        filterChain.doFilter(request,response);
    }

    private void checkImageCode(HttpServletRequest request) {
        /*从cookie取值*/
        Cookie[] cookies = request.getCookies();
        String key = "";
        for (Cookie cookie : cookies) {
            String cookieName = cookie.getName();
            if ("captcha".equals(cookieName)) {
                key = cookie.getValue();
            }
        }
        String redisImageCode = (String) redisTemplate.opsForValue().get(key);
        /*获取图片验证码与redis验证*/
        String imageCode = request.getParameter("imageCode");
        /*redis的验证码不能为空*/
        if (StringUtils.isEmpty(redisImageCode) || StringUtils.isEmpty(imageCode)) {
            throw new ImageCodeException("验证码不能为空");
        }
        /*校验验证码*/
        if (!imageCode.equalsIgnoreCase(redisImageCode)) {
            throw new ImageCodeException("验证码错误");
        }
        redisTemplate.delete(redisImageCode);
    }
}
