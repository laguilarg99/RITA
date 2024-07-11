package com.performance.monitoring.repositories;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.performance.monitoring.interfaces.SensorInterface;
import com.performance.monitoring.models.Sensor;

@Service
public class SensorRepository {
    
    @Autowired
    private SensorInterface repository;
         
    public Sensor saveSensor(Sensor sensor) {
        return repository.save(sensor);
    }

    public Sensor getSensorById(String id) {
        return repository.findById(id).get();
    }

    public Sensor getSensor(String name) {
        return repository.findByName(name);
    }
    
    public List<Sensor> getAllSensor(){
        return repository.findAll();
    }

    public void deleteSensor(String id) {
        repository.deleteById(id);
    }
}
