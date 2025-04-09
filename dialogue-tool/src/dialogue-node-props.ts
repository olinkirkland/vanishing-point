import { NodeProps } from '@vue-flow/core';
import { DialogueOption } from './dialogue';
export default interface DialogueNodeProps extends NodeProps {
    data: DialogueNodePropsData;
}

export interface DialogueNodePropsData {
    label: string;
    prevDialogueIds: string[];
    options: DialogueOption[];
}
