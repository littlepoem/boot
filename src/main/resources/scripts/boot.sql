-- create database
drop database boot;
create database boot character set utf8;

use boot;

drop table if exists sys_user;
CREATE TABLE `sys_user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
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
  `status` varchar(8) COMMENT 'status',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

drop table if exists sys_role;
CREATE TABLE `sys_role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(32) COMMENT '角色编码',
  `nickname` varchar(32) COMMENT '角色名，显示用',
  `description` varchar(64) COMMENT '描述',
  `status` varchar(8) COMMENT 'status',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色表';

drop table if exists sys_user_role;
CREATE TABLE `sys_user_role` (
  `user_id` varchar(32) NOT NULL COMMENT '用户id',
  `role_id` varchar(32) NOT NULL COMMENT '角色id',
  PRIMARY KEY (`role_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户角色关系表';