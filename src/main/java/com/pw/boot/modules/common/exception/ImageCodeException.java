package com.pw.boot.modules.common.exception;

/**
 * @description: 图片验证码异常
 * @author: hjc
 * @create: 2019-11-27
 */
public class ImageCodeException extends RuntimeException{

    public ImageCodeException() {
        super();
    }

    public ImageCodeException(String message) {
        super(message);
    }

    public ImageCodeException(String message, Throwable cause) {
        super(message, cause);
    }

    public ImageCodeException(Throwable cause) {
        super(cause);
    }
}
