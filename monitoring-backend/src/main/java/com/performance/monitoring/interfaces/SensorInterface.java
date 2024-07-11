package com.performance.monitoring.interfaces;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.performance.monitoring.models.Sensor;

public interface SensorInterface extends MongoRepository<Sensor, String> {
    Sensor findByName(String name);
}