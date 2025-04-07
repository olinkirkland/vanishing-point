import { v4 as uuid } from 'uuid';
export type Condition = {
    label: string;
    condition: string;
    connectedNodeId: string;
};

export default class Moment {
    id: string;
    type: string = 'dialogue';
    data: {
        label: string;
        conditions: Condition[];
    };
    position: {
        x: number;
        y: number;
    };

    constructor() {
        this.id = uuid();
        this.data = {
            label: 'Hello world!',
            conditions: []
        };
        this.position = { x: 0, y: 0 };
    }
}
