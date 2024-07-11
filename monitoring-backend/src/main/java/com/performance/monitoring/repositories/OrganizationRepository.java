package com.performance.monitoring.repositories;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.performance.monitoring.interfaces.OrganizationInterface;
import com.performance.monitoring.models.Organization;

@Service
public class OrganizationRepository {

    @Autowired
    private OrganizationInterface repository;

    public Organization saveOrganization(Organization organization) {
        return repository.save(organization);
     }

    public Organization getOrganizationById(String id) {
        return repository.findById(id).get();
    }
     
    public List<Organization> getOrganizationsByUser(String userId) {
        return repository.findByUserId(userId);
    }

    public List<Organization> getAllOrganizations(){
        return repository.findAll();
    }

    public void deleteOrganization(String id) {
        repository.deleteById(id);
    }
}