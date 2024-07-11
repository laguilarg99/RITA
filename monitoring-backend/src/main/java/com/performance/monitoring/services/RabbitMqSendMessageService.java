package com.performance.monitoring.services;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.performance.monitoring.config.RabbitMqConfiguration;

@Service
public class RabbitMqSendMessageService {

    private final AmqpTemplate amqpTemplate;

    public RabbitMqSendMessageService(RabbitTemplate amqpTemplate) {
        this.amqpTemplate = amqpTemplate;
    }

    public void sendToTasks(String message) {
        System.out.println("Task message is sent to RabbitMQ");
        amqpTemplate.convertAndSend(RabbitMqConfiguration.IOT_EXCHANGE,
                RabbitMqConfiguration.TASKS,
                new Message(message.getBytes()));
    }
}
