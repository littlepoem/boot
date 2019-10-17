use boot;

-- 角色表初始化
delete from sys_role;
insert into sys_role(role_id,role_name,role_code,description) values(1304295110606880,'管理员','ROLE_ADMIN','系统的管理员');

-- 用户表初始化
delete from sys_user;
insert into sys_user(user_id,user_name,password) values(1304297583149088,'admin','$2a$10$JnYaod1DUkPGv6Ek2M2H1ONErcJOUqQ6RRUKCnb0rlDvTbt3eZ6PG');

-- 资源表初始化
delete from sys_user;

