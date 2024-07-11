package com.performance.monitoring.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TaskStatusDTO {

    @JsonProperty("taskId")
    private String taskId;

    @JsonProperty("status")
    private String status;

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}