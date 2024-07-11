package com.performance.monitoring.repositories;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.performance.monitoring.interfaces.UserInterface;
import com.performance.monitoring.models.UserLogin;

@Service
public class UserRepository {

    @Autowired
    private UserInterface repository;

    public UserLogin saveUser(UserLogin user) {
        return repository.save(user);
    }

    public UserLogin getUserbyId(String id) {
        return repository.findById(id).get();
    }

    public UserLogin getUser(String username) {
        return repository.findByUsername(username);
    }
    
    public List<UserLogin> getAllUsers(){
        return repository.findAll();
    }

    public void deleteUser(String id) {
        repository.deleteById(id);
    }
}