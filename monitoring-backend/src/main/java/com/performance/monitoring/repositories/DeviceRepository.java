package com.performance.monitoring.repositories;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.performance.monitoring.interfaces.DeviceInterface;
import com.performance.monitoring.models.Device;

@Service
public class DeviceRepository {

    @Autowired
    private DeviceInterface repository;

    public Device saveDevice(Device device) {
        return repository.save(device);
     }

    public Device getDeviceById(String id) {
        return repository.findById(id).get();
    }
     
    public List<Device> getDevicesByOrganizationId(String organizationId) {
        return repository.findByOrganizationId(organizationId);
    }

    public List<Device> getAllDevices(){
        return repository.findAll();
    }

    public void deleteDevice(String id) {
        repository.deleteById(id);
    }
}