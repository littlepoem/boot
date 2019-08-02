package com.pw.boot.modules.common.util;

import com.pw.boot.modules.common.util.bcrypt.BCrypt;

/**
 * @description:
 * @author: hjc
 * @create: 2019-08-02
 */
public class BCryptUtil {

    public static String encrypt(String origin) {

        return BCrypt.hashpw(origin, BCrypt.gensalt());
    }

    public static Boolean check(String origin, String encrypt){

        return BCrypt.checkpw(origin, encrypt);
    }
}
