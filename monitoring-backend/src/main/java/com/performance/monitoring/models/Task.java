package com.performance.monitoring.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Tasks")
public class Task {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    private int period;
    private String status;
    private int cpuTime;
    private int maxResponseTime;
    private int portNumber;
    private String portType;
    private String sensorId;
    private String deviceId;

    public Task(String id, String name, String status, int period, int cpuTime, int maxResponseTime, int portNumber, String portType, String sensorId, String deviceId) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.period = period;
        this.cpuTime = cpuTime;
        this.maxResponseTime = maxResponseTime;
        this.portNumber = portNumber;
        this.portType = portType;
        this.sensorId = sensorId;
        this.deviceId = deviceId;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getPeriod() {
        return period;
    }

    public void setPeriod(int period) {
        this.period = period;
    }

    public int getCpuTime() {
        return cpuTime;
    }

    public void setCpuTime(int cpuTime) {
        this.cpuTime = cpuTime;
    }

    public int getMaxResponseTime() {
        return maxResponseTime;
    }

    public void setMaxResponseTime(int maxResponseTime) {
        this.maxResponseTime = maxResponseTime;
    }

    public int getPortNumber() {
        return portNumber;
    }

    public void setPortNumber(int portNumber) {
        this.portNumber = portNumber;
    }

    public String getPortType() {
        return portType;
    }

    public void setPortType(String portType) {
        this.portType = portType;
    }

    public String getSensorId() {
        return sensorId;
    }

    public void setSensorId(String sensorId) {
        this.sensorId = sensorId;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }
}
