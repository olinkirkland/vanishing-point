import { v4 as uuid } from 'uuid';
export default class Moment {
    id: string;
    type: string = 'dialogue';
    data: {
        [key: string]: any;
    };
    position: {
        x: number;
        y: number;
    };

    constructor() {
        this.id = uuid();
        this.data = {};
        this.position = { x: 0, y: 0 };
    }
}
