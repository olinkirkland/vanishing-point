import { v4 as uuid } from 'uuid';
import { Edge } from '@vue-flow/core';

export type DialogueOption = {
    id: string; // UUID
    label: string; // Label for the option
    condition: string | null; // Condition to show this option (null if no condition)
    nextDialogueId: string | null; // ID of the connected dialogue node (null if no connection)
};

export default class Dialogue {
    id: string; // UUID
    type: string = 'dialogue'; // Always 'dialogue' (Vue Flow uses this to identify the node type)
    data: {
        label: string; // Label for the dialogue node
        options: DialogueOption[]; // Array of options for the dialogue node
    };
    position: {
        x: number; // X position of the node in the flow diagram
        y: number; // Y position of the node in the flow diagram
    };

    constructor() {
        this.id = uuid();
        this.data = {
            label: 'Hello world!',
            options: []
        };
        this.position = { x: 0, y: 0 };
    }
}

export function updateNextDialogueId(
    edges: Edge[],
    dialogues: Dialogue[]
): void {
    console.log('Updating nextDialogueId...');

    // Reset all nextDialogueId values
    dialogues.forEach((dialogue) => {
        dialogue.data.options.forEach((option) => {
            option.nextDialogueId = null;
        });
    });

    // Update nextDialogueId based on edges
    edges.forEach((edge) => {
        const sourceDialogue = dialogues.find(
            (dialogue) => dialogue.id === edge.source
        );
        const targetDialogue = dialogues.find(
            (dialogue) => dialogue.id === edge.target
        );

        if (sourceDialogue && targetDialogue) {
            const option = sourceDialogue.data.options.find(
                (opt) => opt.id === edge.sourceHandle
            );
            if (option) option.nextDialogueId = targetDialogue.id;
        }
    });
}
