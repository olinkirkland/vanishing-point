import { FlowExportObject } from '@vue-flow/core';

export default class Project {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    flow?: FlowExportObject;

    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
