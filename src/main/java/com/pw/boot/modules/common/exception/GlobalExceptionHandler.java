package com.pw.boot.modules.common.exception;

import com.pw.boot.modules.common.util.Result;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @description:
 * @author: hjc
 * @create: 2019-11-27
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    @ResponseBody
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Result> exceptionHandler(Exception e) {
        e.printStackTrace();
        return new ResponseEntity<>(Result.error(), HttpStatus.OK);
    }

    @ResponseBody
    @ExceptionHandler(ImageCodeException.class)
    public ResponseEntity<Result> exceptionHandler(ImageCodeException e) {
        e.printStackTrace();
        return new ResponseEntity<>(Result.error(e.getMessage()),HttpStatus.OK);
    }
}
