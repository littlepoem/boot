package com.pw.boot.modules.common.util;

import com.pw.boot.modules.common.constant.Constants;

import java.util.HashMap;
import java.util.Map;

/**
 * @description: refer to hxyFrame
 * @author: hjc
 * @create: 2019-11-26
 */
public class Result extends HashMap<String, Object> {

    private static final long serialVersionUID = 1L;

    public Result() {
        put("code", "200");
    }

    public Result(int code,String msg) {
        put("code", code);
        put("msg", msg);
    }

    public static Result error() {
        return new Result(Constants.ResultCode.error_common.getValue(),"error");
    }

    public static Result error(String msg) {
        return error(Constants.ResultCode.error_common.getValue(), msg);
    }

    public static Result error(int code, String msg) {
        Result r = new Result();
        r.put("code", code);
        r.put("msg", msg);
        return r;
    }

    public static Result ok(String msg) {
        Result r = new Result();
        r.put("msg", msg);
        return r;
    }

    public static Result ok(Map<String, Object> map) {
        Result r = new Result();
        r.putAll(map);
        return r;
    }

    public static Result ok() {
        return new Result(Constants.ResultCode.success.getValue(),"success");
    }

    public Result put(String key, Object value) {
        super.put(key, value);
        return this;
    }
}
