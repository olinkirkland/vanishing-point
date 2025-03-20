import { v4 } from 'uuid';

export default class Dialogue {
    id: string;
    constructor() {
        this.id = v4();
    }

    /**
     * Load data into the Dialogue object
     * @param data - The data to load into the Dialogue object
     * @returns The Dialogue object
     */
    load(data: any) {
        this.id = data.id;
        return this;
    }

    /**
     * Get a JSON friendly representation of the Dialogue object
     * @returns A JSON friendly representation of the Dialogue object
     */
    save() {
        return {
            id: this.id
        };
    }
}
