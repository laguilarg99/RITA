import { Sensor } from "./sensor";

export class Task {
    id: string;
    name: string;
    status: string;
    period: number;
    cpuTime: number;
    maxResponseTime: number;
    portNumber: number;
    portType: string;
    sensorId: string;
    deviceId: string;

    constructor(
        id: string,
        name: string,
        status: string,
        period: number,
        cpuTime: number,
        maxResponseTime: number,
        portNumber: number,
        portType: string,
        sensorId: string,
        deviceId: string
    ) {
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
}

export class TaskList {
    tasks: Task[];

    constructor(tasks: Task[]) {
        this.tasks = tasks;
    }
}
