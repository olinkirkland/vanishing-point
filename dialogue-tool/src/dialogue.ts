import { v4 } from 'uuid';

export type DialogueData = {
    label: string;
};

export default class Dialogue {
    id: string;
    position: { x: number; y: number };
    data: DialogueData;
    type: string = 'dialogue';
    constructor() {
        this.id = v4();
        this.position = { x: 0, y: 0 };
        this.data = {
            label: '[No Label]'
        };
    }

    /**
     * Load data into the Dialogue object
     * @param data - The data to load into the Dialogue object
     * @returns The Dialogue object
     */
    load(data: any) {
        this.id = data.id;
        this.position = data.position;
        return this;
    }

    /**
     * Get a JSON friendly representation of the Dialogue object
     * @returns A JSON friendly representation of the Dialogue object
     */
    save() {
        return {
            id: this.id,
            position: this.position,
            data: this.data
        };
    }
}
