package com.performance.monitoring.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MetricDTO {
    @JsonProperty("taskId")
    private String taskId;

    @JsonProperty("value")
    private int value;

    @JsonProperty("name")
    private String name;

    @JsonProperty("position")
    private int position;

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public int getPosition() {
        return position;
    }

}