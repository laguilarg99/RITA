package com.performance.monitoring.config;

import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfiguration {

    public static final String METRICS = "METRICS";
    public static final String STATUS = "STATUS";
    public static final String TASKS = "TASKS";
    public static final String IOT_EXCHANGE = "IOT_EXCHANGE";

    @Bean
    Queue queueMetrics() {
      return new Queue(METRICS, false);  
    }
  
    @Bean
    Queue queueStatus() {
      return new Queue(STATUS, false);  
    }

    @Bean
    Queue queueTasks() {
        return new Queue(TASKS, false);
    }

    @Bean
    DirectExchange directIoTExchange() {
        return new DirectExchange(IOT_EXCHANGE);
    }

    @Bean
    Binding bindTasksQueueToExchange() {
      return BindingBuilder
          .bind(queueTasks())
          .to(directIoTExchange())
          .withQueueName();
    }

    @Bean
    Binding bindMetricsQueueToExchange() {
      return BindingBuilder
          .bind(queueMetrics())
          .to(directIoTExchange())
          .withQueueName();
    }
  
    @Bean
    Binding bindStatusQueueToExchange() {
      return BindingBuilder
          .bind(queueStatus())
          .to(directIoTExchange())
          .withQueueName();
    }
    
    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
      final RabbitTemplate template = new RabbitTemplate(connectionFactory);
      return template;
    }
}
