package com.performance.monitoring.interfaces;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.performance.monitoring.models.UserLogin;

public interface UserInterface extends MongoRepository<UserLogin, String> {
    UserLogin findByUsername(String username);
}

