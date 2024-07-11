package com.performance.monitoring.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.performance.monitoring.repositories.TaskRepository;

public class TaskStatusWebSocketHandler extends TextWebSocketHandler {
    private final ObjectMapper objectMapper = new ObjectMapper();    
    @Autowired
    private TaskRepository taskRepository;

    @Override
    @SuppressWarnings("null")
    public void afterConnectionEstablished(WebSocketSession session) throws Exception { 
        while(true){
            Thread.sleep(1000);
            taskRepository.getAllTasks().forEach(task -> {
                try {
                    session.sendMessage(new TextMessage(objectMapper.writeValueAsString(task)));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }
    }
    
}
