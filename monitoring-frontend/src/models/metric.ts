export class Metric {
    id: string;
    name: string;
    value: number;
    date: string;
    position: number
    taskId: string;

    constructor(id: string, name: string, value: number, date: string, position: number, taskId: string) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.position = position;
        this.date = date;
        this.taskId = taskId;
    }
}

export class MetricList {
    metrics: Metric[];
    constructor(metrics: Metric[]) {
        this.metrics = metrics;
    }
}
