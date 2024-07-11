package com.performance.monitoring.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.performance.monitoring.models.Device;
import com.performance.monitoring.repositories.DeviceRepository;
import com.performance.monitoring.repositories.TaskRepository;

@RestController
@RequestMapping("/api")
public class DevicesController {
    
    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private TaskRepository taskRepository;

    @PostMapping("/devices/save")
    public Device saveDevice(@RequestBody Device device) {    
        return deviceRepository.saveDevice(device);
    }

    @PostMapping("/devices")
    public List<Device> getDevices(@RequestBody String orgnizationId) {    
        return deviceRepository.getDevicesByOrganizationId(orgnizationId);
    }
    
    @DeleteMapping("/devices/{id}/delete")
    public void deleteOrganization(@PathVariable("id") String deviceId) {
        taskRepository.getTasksByDeviceId(deviceId).forEach(task -> {
            deviceRepository.deleteDevice(task.getId());
        });  
       deviceRepository.deleteDevice(deviceId);      
    }

}
