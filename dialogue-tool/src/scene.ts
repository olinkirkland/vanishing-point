import { v4 as uuid } from 'uuid';
import Dialogue from './dialogue';

export default class Scene {
    id: string;
    name: string;
    description: string;
    dialogues: Dialogue[];

    constructor(name: string, description: string) {
        this.id = uuid();
        this.name = name;
        this.description = description;
        this.dialogues = [];
    }
}