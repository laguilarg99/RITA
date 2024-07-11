package com.performance.monitoring.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.performance.monitoring.models.Metric;
import com.performance.monitoring.repositories.MetricRepository;

@RestController
@RequestMapping("/api")
public class MetricController {
    
    @Autowired
    private MetricRepository metricRepository;

    @PostMapping("/metrics/save")
    public Metric saveMetric(@RequestBody Metric metric) {    
        return metricRepository.saveMetric(metric);
    }

    @PostMapping("/metrics")
    public List<Metric> getMetrics(@RequestBody String taskId) {    
        return metricRepository.getMetricsByTaskId(taskId);
    }
    
    @DeleteMapping("/metrics/{id}/delete")
    public void deleteMetric(@PathVariable("id") String metricId) {
       metricRepository.deleteMetric(metricId);      
    }

}
