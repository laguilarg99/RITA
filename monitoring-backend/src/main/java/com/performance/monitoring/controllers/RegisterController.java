package com.performance.monitoring.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.performance.monitoring.models.UserLogin;
import com.performance.monitoring.repositories.UserRepository;

@RestController
@RequestMapping("/api")
public class RegisterController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public UserLogin registerUser(@RequestBody UserLogin userCredentials) {
        if(userRepository.getUser(userCredentials.getUsername()) != null) {
            return new UserLogin("", "", "");
        }
        return userRepository.saveUser(userCredentials);
    }
}
