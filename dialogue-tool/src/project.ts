import Scene from '@/scene';
import { v4 as uuid } from 'uuid';

export default class Project {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    scenes: Scene[];

    constructor(name: string, description: string) {
        this.id = uuid();
        this.name = name;
        this.description = description;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.scenes = [];
    }
}
