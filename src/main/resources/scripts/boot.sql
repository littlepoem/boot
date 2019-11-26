-- create database
drop database boot;
create database boot character set utf8;

use boot;

drop table if exists sys_user;
CREATE TABLE `sys_user` (
  `user_id` bigint(16) NOT NULL,
  `user_name` varchar(32) COMMENT '用户名',
  `phone` varchar(32) COMMENT '手机号码',
  `email` varchar(64) COMMENT '邮箱',
  `openid` varchar(255) COMMENT 'openid',
  `nickname` varchar(32) COMMENT '昵称',
  `realname` varchar(32) COMMENT '真实姓名',
  `idcard` varchar(32) COMMENT '身份证',
  `password` varchar(255) COMMENT 'password',
  `birthday` varchar(32) COMMENT '生日',
  `gender` varchar(2) COMMENT '性别',
  `avatar` varchar(255) COMMENT '头像',
  `create_time` datetime,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

drop table if exists sys_role;
CREATE TABLE `sys_role` (
  `role_id` bigint(16) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(32) COMMENT '角色名，显示用',
  `role_code` varchar(32) COMMENT '角色编码',
  `description` varchar(64) COMMENT '描述',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色表';

drop table if exists sys_role_user;
CREATE TABLE `sys_role_user` (
  `user_id` bigint(16) NOT NULL COMMENT '用户id',
  `role_id` bigint(16) NOT NULL COMMENT '角色id',
  PRIMARY KEY (`role_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户角色关系表';

drop table if exists sys_resource;
CREATE TABLE `sys_resource` (
  `resource_id` bigint(16) NOT NULL,
  `parent_id` bigint(16) COMMENT '父资源id',
  `name` varchar(64) COMMENT '资源名称',
  `url` varchar(255) COMMENT '菜单链接',
  `icon` varchar(64) COMMENT '菜单图标',
  `sort` int(11) COMMENT '排序',
  `permission` varchar(64) COMMENT '权限标识',
  `remark` varchar(255) COMMENT '备注',
  `type` varchar(32) COMMENT '资源类型 0根节点 1目录 2菜单 3功能项',
  PRIMARY KEY (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='资源表';

DROP TABLE IF EXISTS `sys_role_resource`;
CREATE TABLE `sys_role_resource` (
  `role_id` bigint(16) NOT NULL COMMENT '角色id',
  `resource_id` bigint(16) NOT NULL COMMENT '资源id',
  PRIMARY KEY (`resource_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色资源表';

