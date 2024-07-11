package com.performance.monitoring.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Organizations")
public class Organization {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String name;
    private String streetAddress;
    private String userId;

    public Organization(String id, String name, String streetAddress, String userId) {
        this.id = id;  
        this.name = name;
        this.streetAddress = streetAddress;
        this.userId = userId;   
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String user) {
        this.userId = user;
    }
    
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }
}