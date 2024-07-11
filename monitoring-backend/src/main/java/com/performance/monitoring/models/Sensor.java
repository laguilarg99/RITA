package com.performance.monitoring.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Sensors")
public class Sensor {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    private String function;
    private String metrics;


    public Sensor(String id, String name, String function, String metrics) {
        this.id = id;
        this.name = name;
        this.function = function;
        this.metrics = metrics;
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

    public String getFunction() {
        return function;
    }

    public void setFunction(String function) {
        this.function = function;
    }

    public String getMetrics() {
        return metrics;
    }

    public void setMetrics(String metrics) {
        this.metrics = metrics;
    }
}
