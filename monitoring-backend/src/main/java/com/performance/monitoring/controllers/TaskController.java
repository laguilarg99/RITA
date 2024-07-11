package com.performance.monitoring.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.performance.monitoring.models.Task;
import com.performance.monitoring.repositories.MetricRepository;
import com.performance.monitoring.repositories.TaskRepository;
import com.performance.monitoring.services.RabbitMqSendMessageService;

@RestController
@RequestMapping("/api")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private MetricRepository metricRepository;

    @Autowired
    private RabbitMqSendMessageService rabbitMqSendMessageService;

    @PostMapping("/tasks/save")
    public Task createTask(@RequestBody Task task) {
        Task auxTask = taskRepository.getTask(task.getName());
        List<String> taskNamesByDeviceId = taskRepository.getTasksByDeviceId(task.getDeviceId())
                                                            .stream().map(Task::getName).collect(Collectors.toList());
       
        if(auxTask.getName() != null && taskNamesByDeviceId.contains(auxTask.getName())) {
            return new Task("", "", "", 0, 0, 0, 0, "", null, null);
        }
        
        Gson gson = new Gson();
        String message = gson.toJson(task);
        rabbitMqSendMessageService.sendToTasks(message);

        return taskRepository.saveTask(task);
    }

    @PostMapping("/tasks/all")
    public List<Task> getAllTasks() {
        return taskRepository.getAllTasks();
    }
    
    @PostMapping("/tasks")
    public List<Task> getTasksByDeviceId(@RequestBody String deviceId) {    
        return taskRepository.getTasksByDeviceId(deviceId);
    }

    @DeleteMapping("/tasks/{id}/delete")
    public void deleteTask(@PathVariable("id") String taskId) {  
        metricRepository.getMetricsByTaskId(taskId).forEach(metric -> {
            metricRepository.deleteMetric(metric.getId());
        });
        taskRepository.deleteTask(taskId);        
    }
}
