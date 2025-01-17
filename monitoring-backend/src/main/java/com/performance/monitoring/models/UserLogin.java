package com.performance.monitoring.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Users")
public class UserLogin {
    
    @Id
    private String id;

    @Indexed(unique = true)
    private String username;
    private String password;

    public UserLogin(String id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }   

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
}
