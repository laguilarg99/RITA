package com.performance.monitoring.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.performance.monitoring.models.UserLogin;
import com.performance.monitoring.repositories.UserRepository;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody UserLogin userCredentials) {       
        UserLogin user = userRepository.getUser(userCredentials.getUsername());
        if (user != null && user.getPassword().equals(userCredentials.getPassword())) {                
            return ResponseEntity.ok().body("{\"id\": \"" + user.getId() + "\"}");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                    .body("{\"error\": \"Invalid credentials\"}");
        }
    }
      


}

