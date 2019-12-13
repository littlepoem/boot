package com.pw.boot.process;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @description:
 * @author: hjc
 * @create: 2019-12-11
 */
public class ProcessApiTest {

    @Autowired
    private RuntimeService runtimeService;

    @Autowired
    private TaskService taskService;

    @Test
    public void startProcess() {
        // 业务逻辑中的id
        String businessKey = "1";
        // 用户1发起了一个请假流程
        ProcessInstance instance = runtimeService.startProcessInstanceByKey("myProcess", businessKey);
        System.out.println("Id: " + instance.getId());
    }

    @Test
    public void startProcessByVar() {
        // 启动流程 指定下一个代理人是谁
        // 创建一个Map存放变量
        Map<String, Object> variables = new HashMap<>();
        // 设置这个流程的下一个代理人是 user1
        variables.put("username", "user1");
        // 这次调用的方法是三个参数的, 最后一个是放变量的
        ProcessInstance instance = runtimeService.startProcessInstanceByKey("myProcess", "1", variables);
        System.out.println("Id: " + instance.getId());
    }

    @Test
    public void queryTask() {
        // 按用户查询
        List<Task> tasks = taskService.createTaskQuery().taskAssignee("user1").list();
        // 按taskId查询
        Task task = taskService.createTaskQuery().taskId("taskId").singleResult();

        // 从任务里拿到流程实例id
        String processInstanceId = task.getProcessInstanceId();

        // 流程实例
        ProcessInstance instance = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
        // 从流程实例信息中拿到 businessKey
        String businessKey = instance.getBusinessKey();
    }

    @Test
    public void completeTask() {
        taskService.complete("2505");
    }

    @Test
    public void completeTaskByVar() {
        // 通过查询可以拿到user2的任务id是7502
        String taskId = "2505";

        // 创建一个Map存放变量
        Map<String, Object> variables = new HashMap<>();
        // 设置这个流程的下一个代理人是 user2
        variables.put("username", "user2");
        // 处理任务
        taskService.complete(taskId, variables);
    }
}
