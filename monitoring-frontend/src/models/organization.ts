export class Organization {
    id: string;
    name: string;
    userId: string;
    streetAddress: string;

    constructor(id: string, name: string, streetAddress: string, userId: string) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.streetAddress = streetAddress;
    }
}

export class OrganizationList {
    organizations: Organization[];

    constructor(organizations: Organization[]) {
        this.organizations = organizations;
    }
}