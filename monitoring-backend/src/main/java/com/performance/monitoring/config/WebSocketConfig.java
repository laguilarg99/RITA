package com.performance.monitoring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    @SuppressWarnings("null")
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(taskStatusWebSocketHandler(), "/taskStatus")
            .setAllowedOrigins("*");
    }

    @Bean
    public WebSocketHandler taskStatusWebSocketHandler() {
        return new TaskStatusWebSocketHandler();
    }

}
