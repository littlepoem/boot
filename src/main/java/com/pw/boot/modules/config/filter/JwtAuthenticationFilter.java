package com.pw.boot.modules.config.filter;

import com.google.gson.Gson;
import com.pw.boot.modules.common.util.JwtUtil;
import com.pw.boot.modules.common.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;

/**
 * @description:
 * @author: hjc
 * @create: 2019-11-27
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.header}")
    private String tokenHeader;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RedisTemplate redisTemplate;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //获取header中的token信息
        String authHeader = request.getHeader(tokenHeader);
        response.setCharacterEncoding("utf-8");
        if (null == authHeader){
            filterChain.doFilter(request,response);
            return;
        }
        String redisKey = authHeader.substring("Bearer ".length());
        if (!redisTemplate.hasKey(redisKey)){
            response.setContentType("application/json;charset=utf-8");
            response.getWriter().write(new Gson().toJson(
                    Result.error("登录信息已过期")
            ));
            return;
        }
        String token = (String) redisTemplate.opsForValue().get(redisKey);
        if(StringUtils.isEmpty(token)){
            filterChain.doFilter(request,response);
            return;
        }
        String userName = jwtUtil.parseToken(token);
        UserDetails userDetails = new User(userName, null, (Set<GrantedAuthority>)jwtUtil.getClaims(token));

        //将信息交给security
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails,null, userDetails.getAuthorities());
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        filterChain.doFilter(request,response);
    }
}
