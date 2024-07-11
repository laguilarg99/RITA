package com.performance.monitoring.repositories;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.performance.monitoring.interfaces.MetricInterface;
import com.performance.monitoring.models.Metric;

@Service
public class MetricRepository {

    @Autowired
    private MetricInterface repository;

    public Metric saveMetric(Metric metric) {
        return repository.save(metric);
     }

    public Metric getMetricById(String id) {
        return repository.findById(id).get();
    }
     
    public List<Metric> getMetricsByTaskId(String taskId) {
        return repository.findByTaskId(taskId);
    }

    public List<Metric> getAllMetrics(){
        return repository.findAll();
    }

    public void deleteMetric(String id) {
        repository.deleteById(id);
    }
}