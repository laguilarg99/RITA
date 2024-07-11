package com.performance.monitoring.repositories;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.performance.monitoring.interfaces.TaskInterface;
import com.performance.monitoring.models.Task;

@Service
public class TaskRepository {

    @Autowired
    private TaskInterface repository;

    public Task saveTask(Task task) {
        return repository.save(task);
    }

    public List<Task> getTasksByDeviceId(String deviceId) {
        return repository.findByDeviceId(deviceId);
    }

    public Task getTask(String name) {
        return repository.findByName(name);
    }

    public Task getTaskById(String id) {
        return repository.findById(id).get();
    }
    
    public List<Task> getAllTasks(){
        return repository.findAll();
    }

    public void deleteTask(String id) {
        repository.deleteById(id);
    }
}