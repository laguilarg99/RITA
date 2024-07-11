package com.performance.monitoring.interfaces;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.performance.monitoring.models.Device;

import java.util.List;


public interface DeviceInterface extends MongoRepository<Device, String> {
    List<Device> findByOrganizationId(String organizationId);
}