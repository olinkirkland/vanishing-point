import { v4 } from 'uuid';
import Dialogue from './dialogue';

export default class Scene {
    id: string;
    dialogues: Dialogue[] = [];

    constructor() {
        this.id = v4();
    }

    /**
     * Load data into the Scene object
     * @param data - The data to load into the Scene object
     * @returns The Scene object
     */

    load(data: any) {
        this.id = data.id;
        this.dialogues = data.dialogues.map((dialogueData: any) => {
            const dialogue = new Dialogue();
            dialogue.load(dialogueData);
            return dialogue;
        });
        return this;
    }

    /**
     * Get a JSON friendly representation of the Scene object
     * @returns A JSON friendly representation of the Scene object
     */
    save() {
        return {
            id: this.id,
            dialogues: this.dialogues.map((dialogue) => dialogue.save())
        };
    }
}
