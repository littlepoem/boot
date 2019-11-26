package com.pw.boot.modules.common.constant;

/**
 * @description: 常量类
 * @author: hjc
 * @create: 2019-11-12
 */
public class Constants {

    public enum ResultCode {
        /**
         * 成功码
         */
        success(0),
        /**
         * 错误码
         */
        error_common (-1),
        /**
         * 错误码 500
         */
        error_inner (500);

        private int value;

        private ResultCode(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }

    /**
     * 资源类型
     */
    public enum ResourceType {
        /**
         * 根节点
         */
        root("0"),
        /**
         * 目录
         */
        directory("1"),
        /**
         * 菜单
         */
        menu("2"),
        /**
         * 功能项
         */
        function("3");

        private String value;

        private ResourceType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
