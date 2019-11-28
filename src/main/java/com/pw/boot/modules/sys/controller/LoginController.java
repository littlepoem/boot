package com.pw.boot.modules.sys.controller;

import com.google.code.kaptcha.Producer;
import com.pw.boot.modules.common.constant.Constants;
import com.pw.boot.modules.common.util.SequenceUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * @author: hjc
 * @description:
 * @create: 2019-06-06
 */
@Controller
@Slf4j
public class LoginController {

    @Autowired
    private Producer defaultKaptcha;

    @Autowired
    private RedisTemplate redisTemplate;

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login(){

        return "login.html";
    }

    @RequestMapping("/login/captcha")
    public void captcha(HttpServletResponse response)throws ServletException, IOException {

        response.setDateHeader("Expires",0);
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        response.addHeader("Cache-Control", "post-check=0, pre-check=0");
        response.setHeader("Pragma", "no-cache");
        response.setContentType("image/jpeg");

        //生成文字验证码
        String code = defaultKaptcha.createText();
        if(log.isDebugEnabled()){
            log.debug("验证码============>" + code);
        }
        /*验证码以key，value的形式缓存到redis 存放时间一分钟*/
        String redisKey = Constants.RedisKey.imageCode.getValue() + SequenceUtil.nextId();
        redisTemplate.opsForValue().set(redisKey, code,1, TimeUnit.MINUTES);
        Cookie cookie = new Cookie("captcha",redisKey);
        /*key写入cookie，验证时获取*/
        response.addCookie(cookie);
        //生成图片验证码
        BufferedImage image = defaultKaptcha.createImage(code);

        ServletOutputStream out = response.getOutputStream();
        ImageIO.write(image, "jpg", out);
    }
}
