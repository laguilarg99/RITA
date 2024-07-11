export class Device {
    id: string;
    name: string;
    ip: string;
    port: number;
    organizationId: string

    constructor(id: string, name: string, ip: string, port: number, organizationId: string) {
        this.id = id;
        this.name = name;
        this.ip = ip;   
        this.port = port;
        this.organizationId = organizationId;
    }
}

export class DeviceList {
    devices: Device[];

    constructor(devices: Device[]) {
        this.devices = devices;
    }
}