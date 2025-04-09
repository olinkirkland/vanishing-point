<template>
    <div v-if="project" class="page page--project">
        <!-- Vue Flow Component -->
        <VueFlow
            :nodes="nodes"
            :edges="edges"
            :snap-to-grid="true"
            :snap-grid="[16, 16]"
            :zoom-on-double-click="false"
            :connection-mode="ConnectionMode.Strict"
            v-on:nodes-change="onNodesChange"
        >
            <template
                #node-dialogue="dialogueNodeProps"
                v-on:drag="dialogueNodeProps.onDrag"
                v-on:dragend="dialogueNodeProps.setPosition"
            >
                <DialogueNode v-bind="dialogueNodeProps" />
            </template>
            <template #edge-dialogue="specialEdgeProps">
                <SpecialEdge v-bind="specialEdgeProps" />
            </template>
            <Background :gap="16" :offset="0" />
        </VueFlow>
        <!-- Left Sidebar -->
        <Panel class="sidebar sidebar--left">
            <section class="sidebar__project">
                <div class="flex">
                    <Button @click="onClickGoHome">
                        <i class="fas fa-chevron-left"></i>
                        <span>Home</span>
                    </Button>
                </div>
                <div class="sidebar__header">
                    <h2>{{ project.name }}</h2>
                    <Button @click="onClickOpenProjectSettings" icon>
                        <i class="fas fa-cog"></i>
                    </Button>
                </div>
                <p>{{ project.description }}</p>
                <Button @click="onClickAddScene" full-width>
                    <i class="fas fa-plus"></i>
                    <span>Add Scene</span>
                </Button>
                <List class="scenes">
                    <li v-if="project.scenes.length === 0">
                        <em>No scenes yet.</em>
                    </li>
                    <li
                        v-for="scene in project.scenes"
                        :key="scene.id"
                        @click="
                            selectedScene === scene
                                ? (selectedScene = null)
                                : (selectedScene = scene)
                        "
                        :class="{
                            'is-selected': selectedScene?.id === scene.id
                        }"
                    >
                        <i class="fas fa-layer-group"></i>
                        <div class="full-width flex spread">
                            <span>{{ scene.name }}</span>
                            <span class="muted">{{
                                scene.dialogues.length
                            }}</span>
                        </div>
                    </li></List
                >
            </section>
            <section class="sidebar__scene" v-if="selectedScene">
                <div class="sidebar__header">
                    <h2>{{ selectedScene.name }}</h2>
                    <Button @click="onClickOpenSceneSettings" icon>
                        <i class="fas fa-cog"></i>
                    </Button>
                </div>
                <p>{{ selectedScene.description }}</p>
                <Button @click="onClickAddDialogue" full-width>
                    <i class="fas fa-plus"></i>
                    <span>Add Dialogue</span>
                </Button>
                <List class="dialogue">
                    <li v-if="selectedScene?.dialogues.length === 0">
                        <em>No dialogues yet.</em>
                    </li>
                    <li
                        v-for="dialogue in selectedScene?.dialogues"
                        :key="dialogue.id"
                        :class="{
                            'is-selected': selectedDialogue?.id === dialogue.id
                        }"
                        @click="onClickSelectDialogueInList(dialogue)"
                    >
                        <i class="fas fa-sticky-note"></i>
                        <div class="full-width flex spread">
                            <em>{{ dialogue.id.substring(0, 8) }}</em>
                            <span class="muted">
                                {{
                                    dialogue.data.options.filter(
                                        (option) => option.nextDialogueId
                                    ).length
                                }}/{{ dialogue.data.options.length }}</span
                            >
                        </div>
                    </li>
                </List>
            </section>
        </Panel>
        <!-- Dialogue Panel -->
        <Transition name="sidebar-transition">
            <Panel class="sidebar sidebar--right" v-if="selectedDialogue">
                <div class="sidebar__header">
                    <h2>Dialogue</h2>
                    <Button @click="onClickCloseDialogue" icon>
                        <i class="fas fa-times"></i>
                    </Button>
                </div>

                <div class="input-box">
                    <label :for="`${selectedDialogue.id}-label`">Label</label>
                    <input
                        :id="`${selectedDialogue.id}-label`"
                        type="text"
                        v-model="selectedDialogue.data.label"
                        placeholder="Label"
                    />
                </div>

                <!-- Add Option button -->
                <Button @click="onClickAddOption" full-width>
                    <i class="fas fa-plus"></i>
                    <span>Add Option</span>
                </Button>

                <!-- List of options -->
                <List class="options">
                    <li v-if="selectedDialogue?.data.options.length === 0">
                        <em>No options yet.</em>
                    </li>
                    <li
                        v-for="(option, index) in selectedDialogue?.data
                            .options"
                        :key="option.id"
                        :class="{ 'is-connected': option.nextDialogueId }"
                    >
                        <div class="flex">
                            <span>
                                <em>{{ option.id }}</em>
                            </span>
                        </div>
                        <div class="connected-node">
                            <span v-if="option.nextDialogueId">
                                <em>{{ option.nextDialogueId }}</em>
                            </span>
                            <span v-else>Not connected</span>
                        </div>
                        <div class="flex">
                            <Button @click.stop="onClickRemoveOption(index)">
                                <i class="fas fa-trash"></i>
                                <span>Delete</span>
                            </Button>
                            <Button
                                @click.stop="onClickUnlinkOption(index)"
                                :disabled="!option.nextDialogueId"
                            >
                                <i class="fas fa-unlink"></i>
                                <span>Unlink</span>
                            </Button>
                        </div>
                    </li>
                </List>

                <pre>{{ selectedDialogue }}</pre>

                <!-- Remove Dialogue button -->
                <Button @click="onClickRemoveSelectedDialogue" full-width>
                    <i class="fas fa-trash"></i>
                    <span>Delete Dialogue</span>
                </Button>
            </Panel>
        </Transition>
    </div>
    <div v-else class="page page--project-not-found">
        <p>Project not found.</p>
        <Button @click="onClickGoHome">
            <i class="fas fa-chevron-left"></i>
            <span>Home</span>
        </Button>
    </div>
</template>

<script setup lang="ts">
import DialogueNode from '@/components/flow/DialogueNode.vue';
import SpecialEdge from '@/components/flow/SpecialEdge.vue';
import Button from '@/components/ui/Button.vue';
import Panel from '@/components/ui/Panel.vue';
import ModalController from '@/controllers/modal-controller';
import Dialogue, { DialogueOption } from '@/dialogue';
import Project from '@/project';
import { PageName, router } from '@/router';
import Scene from '@/scene';
import { useProjectsStore } from '@/store/projects-store';
import { Background } from '@vue-flow/background';
import {
    ConnectionMode,
    Edge,
    GraphNode,
    Node,
    NodeChange,
    useVueFlow,
    VueFlow,
    VueFlowStore
} from '@vue-flow/core';
import { v4 as uuid } from 'uuid';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import SettingsModal from '../modals/templates/ProjectSettingsModal.vue';
import List from '../ui/List.vue';

const { onPaneReady, toObject, addNodes, updateNodeInternals, updateNode } =
    useVueFlow();

const route = useRoute();
const projectsStore = useProjectsStore();
const projectId = ref<string | null>((route.params.id as string) || null);
const project = ref<Project | null>(
    projectsStore.getProjectById(projectId.value as string) || null
);

const vueFlowInstance = ref<VueFlowStore | null>(null);
const selectedScene = ref<Scene | null>(null);
const selectedDialogue = ref<Dialogue | null>(null);
const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);

/**
 * Initialize the VueFlow instance and set up event listeners for connect events
 * and node changes.
 * This is where the VueFlow instance is created and the initial nodes and edges are set.
 */

onPaneReady((vueFlow) => {
    console.log('VueFlow instance ready', vueFlow);

    // Set the initial nodes and edges
    vueFlowInstance.value = vueFlow;
    vueFlowInstance.value?.setViewport({ x: 0, y: 0, zoom: 1 });

    // Select the first scene by default
    selectedScene.value = project.value!.scenes[0] || null;

    listenForConnectEvents();
});

/**
 * Project and Flow management
 */

// Listen for when the flow dispatches connect events

// Watch selectedScene.id, load the correct nodes and edges
watch(() => selectedScene.value?.id, populateScene);

// Update a node when its data changes (label)
watch(
    () => selectedDialogue.value?.data.label,
    (newLabel) => {
        if (!selectedDialogue.value) return;

        updateNode(selectedDialogue.value.id, {
            data: {
                ...selectedDialogue.value.data,
                label: newLabel
            }
        });
    }
);

// Load the nodes and edges when the scene changes
function populateScene() {
    if (!selectedScene.value) {
        nodes.value = [];
        return;
    }

    nodes.value = selectedScene.value.dialogues;
    edges.value = makeEdgesFromProject();

    selectedDialogue.value = null;
    if (!vueFlowInstance.value) return;
    vueFlowInstance.value.setCenter(0, 0, {
        duration: 0,
        zoom: 1
    });
}

// Apply the flow (nodes and edges) to the project graph
function applyFlowToProject() {
    if (!project.value) return;
    const projectObject = toObject();
    project.value.scenes.forEach((scene) => {
        scene.dialogues.forEach((dialogue) => {
            const node = projectObject.nodes.find(
                (node) => node.id === dialogue.id
            );
            if (node) {
                dialogue.position = node.position;
                dialogue.data = node.data;
            }
        });
    });
}

// Listen for connect events to add edges
function listenForConnectEvents() {
    vueFlowInstance.value?.onConnect((params) => {
        // Add the new edge to the flow
        edges.value.push({
            id: `edge-${params.source}-${params.target}`,
            source: params.source,
            target: params.target,
            sourceHandle: params.sourceHandle,
            targetHandle: params.targetHandle
        });

        // Update the project with the new edge:
        const sourceDialogue = selectedScene.value?.dialogues.find(
            (dialogue) => dialogue.id === params.source
        );
        const targetDialogue = selectedScene.value?.dialogues.find(
            (dialogue) => dialogue.id === params.target
        );
        if (!sourceDialogue || !targetDialogue) return;
        const sourceOption = sourceDialogue.data.options.find(
            (option) => option.id === params.sourceHandle
        );
        if (!sourceOption) return;

        // 1. Set the source option's nextDialogueId to the target's id (incoming handle id is the same as the dialogue id)
        sourceOption.nextDialogueId = targetDialogue.id;

        // 2. Push the target's prevDialogueIds array with the source option's id
        console.log(
            `Setting targetDialogue (id: ${targetDialogue.id.substring(0, 8)})`,
            `prevDialogueIds.push(${sourceOption.id})`
        );
        targetDialogue.data.prevDialogueIds.push(sourceOption.id);
    });
}

// Populate the edges array from the project data
function makeEdgesFromProject() {
    if (!selectedScene.value) return [];
    const edges: Edge[] = [];
    // TODO: Implement edges from project
    // Loop over each option in each dialogue and create an edge from it to its target (nextDialogueId)
    // If the nextDialogueId is null, skip it

    return edges;
}

// Remove an option (project/scene/dialogue/option) from the project
// and the VueFlow instance
function removeOption(index: number) {
    if (!selectedDialogue.value) return;
    const optionId = selectedDialogue.value.data.options[index].id;
    selectedDialogue.value.data.options.splice(index, 1);

    // Update the node
    updateNode(selectedDialogue.value.id, {
        data: {
            ...selectedDialogue.value.data,
            options: selectedDialogue.value.data.options
        }
    });

    // Remove any edges with the option id as sourceHandle
    edges.value = edges.value.filter((edge) => edge.sourceHandle !== optionId);
    updateNodeInternals([selectedDialogue.value.id]);
}

// Set the selectedDialogue based on the selected node in the VueFlow instance
function onNodesChange(changes: NodeChange[]) {
    changes.forEach((change) => {
        // When selection change happens, change selectedDialogue
        switch (change.type) {
            case 'select':
                if (!change.selected) {
                    selectedDialogue.value = null;
                    return;
                }

                const selectedNode = vueFlowInstance.value?.getNode(change.id);
                if (!selectedNode) return;

                const dialogue = selectedScene.value?.dialogues.find(
                    (dialogue) => dialogue.id === selectedNode.id
                );
                if (!dialogue) return;
                setTimeout(() => {
                    // setTimeout here is to ensure the node is selected before we set the selectedDialogue
                    // Multiple changes can happen at once, and we want to ensure the selectedDialogue is set after the node is selected
                    selectedDialogue.value = dialogue;
                }, 0);
                break;
            default:
                break;
        }
    });

    applyFlowToProject();
}

/**
 * Utility functions
 */

// Pan the viewport to the center of the node, taking into account the sidebars
function panToNode(node: GraphNode | undefined) {
    if (!vueFlowInstance.value || !node) return;

    // Pan to the node's center
    const leftSidebarOffsetX =
        ((document.querySelector('.sidebar--left')?.clientWidth || 0) + 32) / 2;

    const rightSidebarOffsetX =
        ((document.querySelector('.sidebar--right')?.clientWidth || 0) + 32) /
        2;

    const centerOffsetX = (node.dimensions.width as number) / 2;
    const centerOffsetY = (node.dimensions.height as number) / 2;
    const center = {
        x:
            node.position.x +
            centerOffsetX -
            leftSidebarOffsetX +
            rightSidebarOffsetX,
        y: node.position.y + centerOffsetY
    };
    vueFlowInstance.value.setCenter(center.x, center.y, {
        duration: 200,
        zoom: 1
    });
}

/**
 * Project UI handlers
 */
function onClickGoHome() {
    router.push({ name: PageName.HOME });
}

function onClickOpenProjectSettings() {
    ModalController.open(SettingsModal, { project: project.value });
}

/**
 * Scene UI handlers
 */
function onClickOpenSceneSettings() {
    // TODO: Implement scene settings modal
}

function onClickAddScene() {
    const newScene = new Scene('Untitled Scene', 'Lorem ipsum dolor sit amet.');
    project.value?.scenes.push(newScene);
}

function onClickAddDialogue() {
    const newDialogue = new Dialogue();
    selectedScene.value?.dialogues.push(newDialogue);
    addNodes([newDialogue]);
}

function onClickSelectDialogueInList(dialogue: Dialogue) {
    if (!vueFlowInstance.value) return;
    selectedDialogue.value = dialogue;

    const node = vueFlowInstance.value.getNode(dialogue.id);
    if (!node) return;

    // Select the node
    vueFlowInstance.value.getSelectedNodes.forEach((n) => {
        n.selected = false;
    });
    node.selected = true;

    setTimeout(() => {
        // Wait for one frame to ensure the right panel is open before panning to the node
        // Panning takes the UI into account (to center the node in the viewport)
        panToNode(node);
    }, 0);
}

/**
 * Dialogue UI handlers
 */
function onClickCloseDialogue() {
    if (!vueFlowInstance.value || !selectedDialogue.value) return;
    const selectedNode = vueFlowInstance.value.getNode(
        selectedDialogue.value?.id
    );
    if (!selectedNode) return;
    selectedNode.selected = false;
    selectedDialogue.value = null;
}

function onClickAddOption() {
    if (!selectedDialogue.value) return;
    const newOption: DialogueOption = {
        id: uuid(),
        label: 'New Option',
        nextDialogueId: null,
        condition: null
    };

    selectedDialogue.value.data.options.push(newOption);

    // Update the node
    updateNode(selectedDialogue.value.id, {
        data: {
            ...selectedDialogue.value.data,
            options: selectedDialogue.value.data.options
        }
    });
}

function onClickUnlinkOption(index: number) {
    if (!selectedDialogue.value) return;
    const option = selectedDialogue.value.data.options[index];
    if (!option) return;

    // Remove the source option from the target's prevDialogueIds array
    const targetDialogue = selectedScene.value?.dialogues.find(
        (dialogue) => dialogue.id === option.nextDialogueId
    );

    if (targetDialogue) {
        console.log(targetDialogue.data.prevDialogueIds);
        targetDialogue.data = {
            ...targetDialogue.data,
            prevDialogueIds: targetDialogue.data.prevDialogueIds.filter(
                (id) => id !== option.id
            )
        };
        console.log(targetDialogue.data.prevDialogueIds);
    }

    // Remove the nextDialogueId from the option
    option.nextDialogueId = null;

    // Remove the edge with the option id as sourceHandle
    edges.value = edges.value.filter((edge) => edge.sourceHandle !== option.id);
    updateNodeInternals([selectedDialogue.value.id]);

    // Update the node
    updateNode(selectedDialogue.value.id, {
        data: {
            ...selectedDialogue.value.data,
            options: selectedDialogue.value.data.options
        }
    });
}

function onClickRemoveOption(index: number) {
    removeOption(index);
}

function onClickRemoveSelectedDialogue() {
    if (!selectedDialogue.value) return;
    while (selectedDialogue.value.data.options.length > 0) removeOption(0);
    selectedScene.value?.dialogues.splice(
        selectedScene.value.dialogues.indexOf(selectedDialogue.value),
        1
    );
}
</script>

<style lang="scss" scoped>
.page--project {
    position: relative;
    padding: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    justify-content: space-between;
}

.sidebar {
    z-index: 1;
    max-width: 32rem;
    flex: 1;
    overflow: hidden;
}

.sidebar__header {
    width: 100%;
    background-color: var(--color-surface);
    padding-left: 1.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    > * {
        opacity: 0.5;
    }
}

:deep(section) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.8rem;

    &:not(:last-child) {
        margin-bottom: 2.4rem;
    }
}

:deep(section.sidebar__scene) {
    width: 100%;
    flex: 1;
    overflow: hidden;
}

:deep(ul.scenes) {
    max-height: 20rem;
}

:deep(ul.dialogue) {
    flex: 1;
}

:deep(.sidebar ul.options) {
    min-height: 40rem;

    > li {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.4rem;
        overflow: hidden;
        cursor: unset;

        > span {
            text-overflow: ellipsis;
            overflow: hidden;
            width: 100%;
        }

        &.is-connected {
            // TODO: Style connected options
        }
    }
}

// Sidebar Transition
.sidebar-transition-enter-active,
.sidebar-transition-leave-active {
    transition: all 0.2s ease;
}

.sidebar-transition-enter-from,
.sidebar-transition-leave-to {
    opacity: 0;
    transform: translateX(2rem);
}
</style>

<style lang="scss">
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

.vue-flow {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}
</style>
