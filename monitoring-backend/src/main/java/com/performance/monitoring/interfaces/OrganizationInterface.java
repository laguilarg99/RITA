package com.performance.monitoring.interfaces;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.performance.monitoring.models.Organization;

import java.util.List;


public interface OrganizationInterface extends MongoRepository<Organization, String> {
    List<Organization> findByUserId(String userId);
}

