package com.performance.monitoring.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.performance.monitoring.models.Organization;
import com.performance.monitoring.repositories.DeviceRepository;
import com.performance.monitoring.repositories.OrganizationRepository;

@RestController
@RequestMapping("/api")
public class OrganizationsController {
    
    @Autowired
    private OrganizationRepository organizationRepository; 
    
    @Autowired
    private DeviceRepository deviceRepository;


    @PostMapping("/organizations/save")
    public Organization saveOrganization(@RequestBody Organization organization) {    
        return organizationRepository.saveOrganization(organization);
    }

    @PostMapping("/organizations")
    public List<Organization> getOrganizations(@RequestBody String userId) {    
        return organizationRepository.getOrganizationsByUser(userId);
    }

    @DeleteMapping("/organizations/{id}/delete")
    public void deleteOrganization(@PathVariable("id") String organizationId) {    
        deviceRepository.getDevicesByOrganizationId(organizationId).forEach(device -> {
            deviceRepository.deleteDevice(device.getId());
        });
        organizationRepository.deleteOrganization(organizationId);        
    }
}
