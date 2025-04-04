import { v4 as uuid } from 'uuid';
export default class Moment {
    id: string;

    constructor() {
        this.id = uuid();
    }
}
