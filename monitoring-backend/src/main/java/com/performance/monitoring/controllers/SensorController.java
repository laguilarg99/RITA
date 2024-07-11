package com.performance.monitoring.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.performance.monitoring.models.Sensor;
import com.performance.monitoring.repositories.SensorRepository;

@RestController
@RequestMapping("/api")
public class SensorController {

    @Autowired
    private SensorRepository sensorRepository;

    @PostMapping("/sensors/save")
    public Sensor registerSensor(@RequestBody Sensor sensor) {
        if(sensorRepository.getSensor(sensor.getName()) != null) {
            return new Sensor("", "", "", "");
        }
        return sensorRepository.saveSensor(sensor);
    }

    @PostMapping("/sensors/all")
    public List<Sensor> getSensors() {
        return sensorRepository.getAllSensor();
    }
    
    @PostMapping("/sensors/{id}")
    public Sensor getSensorById(@PathVariable("id") String sensorId) {
        return sensorRepository.getSensorById(sensorId);
    }
    

    @DeleteMapping("/sensors/{id}/delete")
    public void deleteSensor(@PathVariable("id") String sensorId) {    
        sensorRepository.deleteSensor(sensorId);        
    }
}
