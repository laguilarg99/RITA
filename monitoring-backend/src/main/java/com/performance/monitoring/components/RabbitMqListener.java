package com.performance.monitoring.components;

import java.time.Instant;
import java.util.UUID;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.performance.monitoring.models.Metric;
import com.performance.monitoring.models.MetricDTO;
import com.performance.monitoring.models.Task;
import com.performance.monitoring.models.TaskStatusDTO;
import com.performance.monitoring.repositories.MetricRepository;
import com.performance.monitoring.repositories.TaskRepository;

@Component
class RabbitMqListener {

    @Autowired 
    private MetricRepository metricRepository;

    @Autowired
    private TaskRepository taskRepository;

    @RabbitListener(queues = "STATUS")
    public void listenerForStatus(String message) throws JsonMappingException, JsonProcessingException {
      System.out.println("Provided status: " + message);
      
      ObjectMapper objectMapper = new ObjectMapper();
      TaskStatusDTO taskJSON = objectMapper.readValue(message, TaskStatusDTO.class);

      Task taskToUpdate = taskRepository.getTaskById(taskJSON.getTaskId());
      if (taskToUpdate != null) {
          taskToUpdate.setStatus(taskJSON.getStatus());
          taskRepository.saveTask(taskToUpdate); // Guarda los cambios en la base de datos
          System.out.println("Task status updated successfully.");
      } else {
          System.out.println("Task with ID " + taskJSON.getTaskId() + " not found in the database.");
      }

    }

    @RabbitListener(queues = "METRICS")
    public void listenerForMetrics(String message) throws JsonMappingException, JsonProcessingException {
      System.out.println("Provided metrics: " + message);
      
      ObjectMapper objectMapper = new ObjectMapper();
      MetricDTO metricJSON = objectMapper.readValue(message, MetricDTO.class);

      UUID metricId = UUID.randomUUID();
      Metric metric = new Metric(metricId.toString(), 
                                 metricJSON.getName(), 
                                 metricJSON.getValue(),  
                                 Instant.now() + "", 
                                 metricJSON.getPosition(), 
                                 metricJSON.getTaskId());
                               
      metricRepository.saveMetric(metric);
    }
}