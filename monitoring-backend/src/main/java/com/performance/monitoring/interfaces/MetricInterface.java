package com.performance.monitoring.interfaces;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.performance.monitoring.models.Metric;

import java.util.List;


public interface MetricInterface extends MongoRepository<Metric, String> {
    List<Metric> findByTaskId(String taskId);
}