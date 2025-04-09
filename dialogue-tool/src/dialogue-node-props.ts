import {
    Dimensions,
    HandleConnectable,
    NodeEventsOn,
    NodeProps,
    Position,
    ValidConnectionFunc,
    XYPosition
} from '@vue-flow/core';
import { VNode, RendererNode, RendererElement, Component } from 'vue';
import { DialogueOption } from './dialogue';
export default interface DialogueNodeProps extends NodeProps {
    id: string;
    type: string;
    selected: boolean;
    connectable: HandleConnectable;
    position: XYPosition;
    dimensions: Dimensions;
    label?:
        | string
        | object
        | VNode<RendererNode, RendererElement, { [key: string]: any }>
        | Component
        | undefined;
    isValidTargetPos?: ValidConnectionFunc | undefined;
    isValidSourcePos?: ValidConnectionFunc | undefined;
    parent?: string | undefined;
    parentNodeId?: string | undefined;
    dragging: boolean;
    resizing: boolean;
    zIndex: number;
    targetPosition?: Position | undefined;
    sourcePosition?: Position | undefined;
    dragHandle?: string | undefined;
    data: DialogueNodePropsData;
    events: NodeEventsOn<object>;
}

export interface DialogueNodePropsData {
    label: string;
    prevDialogueIds: string[];
    options: DialogueOption[];
}
