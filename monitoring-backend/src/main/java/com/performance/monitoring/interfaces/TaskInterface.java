package com.performance.monitoring.interfaces;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.performance.monitoring.models.Task;

import java.util.List;


public interface TaskInterface extends MongoRepository<Task, String> {
    List<Task> findByDeviceId(String deviceId);
    Task findByName(String name);
}

