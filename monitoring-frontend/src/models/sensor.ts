export class Sensor {
    id: string;
    name: string;
    function: string;
    metrics: string;
    
    constructor(id: string, name: string, func: string, metrics: string) {
        this.id = id;
        this.name = name;
        this.function = func;
        this.metrics = metrics;
    }
}

export class SensorList {
    sensors: Sensor[];

    constructor(sensors: Sensor[]) {
        this.sensors = sensors;
    }
}