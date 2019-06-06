package com.pw.boot.modules.config.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Service;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author: hjc
 * @description: 登录成功后访问越权处理类
 * @create: 2019-06-06
 */
@Service
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
                       AccessDeniedException e) throws IOException, ServletException {

        // is ajax request
        if ("XMLHttpRequest".equals(httpServletRequest.getHeader("X-Requested-With"))) {

            //todo 返回json错误信息？？
            httpServletResponse.sendError(HttpServletResponse.SC_FORBIDDEN);

        }else if (!httpServletResponse.isCommitted()) {

            httpServletResponse.sendError(HttpServletResponse.SC_FORBIDDEN,e.getMessage());
        }
    }
}
