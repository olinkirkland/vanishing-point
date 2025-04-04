import { v4 as uuid } from 'uuid';
import Moment from './moment';

export default class Scene {
    id: string;
    name: string;
    description: string;
    moments: Moment[];

    constructor(name: string, description: string) {
        this.id = uuid();
        this.name = name;
        this.description = description;
        this.moments = [];
    }
}
