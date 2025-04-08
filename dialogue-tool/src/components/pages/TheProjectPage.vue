<template>
    <div v-if="project" class="page page--project">
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
        <Panel class="sidebar sidebar--left">
            <section class="sidebar__project">
                <div class="flex">
                    <Button @click="onClickHome">
                        <i class="fas fa-chevron-left"></i>
                        <span>Home</span>
                    </Button>
                </div>
                <div class="sidebar__header">
                    <h2>{{ project.name }}</h2>
                    <Button @click="onClickProjectSettings" icon>
                        <i class="fas fa-cog"></i>
                    </Button>
                </div>
                <p>{{ project.description }}</p>
                <Button @click="onClickAddScene" full-width>
                    <i class="fas fa-plus"></i>
                    <span>New Scene</span>
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
                        <span>{{ scene.name }}</span>
                    </li></List
                >
            </section>
            <section class="sidebar__scene" v-if="selectedScene">
                <div class="sidebar__header">
                    <h2>{{ selectedScene.name }}</h2>
                    <Button @click="onClickSceneSettings" icon>
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
                        @click="onClickDialogue(dialogue)"
                    >
                        <i class="fas fa-sticky-note"></i>
                        <span>
                            <em>{{ dialogue.id.substring(0, 8) }}</em>
                        </span>
                    </li>
                </List>
                <!-- <Button @click="onClickAction" full-width>
                    <i class="fas fa-play"></i>
                    <span>Perform Action</span>
                </Button> -->
            </section>
        </Panel>
        <!-- Dialogue Panel -->
        <Transition name="sidebar-transition">
            <Panel class="sidebar sidebar--right" v-if="selectedDialogue">
                <div class="sidebar__header">
                    <h2>Dialogue</h2>
                    <Button @click="onClickDialogueClose" icon>
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

                <pre>{{ selectedDialogue }}</pre>

                <!-- Add option button -->
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
                        @click="onClickOption(option)"
                    >
                        <i class="fas fa-code-branch"></i>
                        <span>
                            <em>{{ option.id }}</em>
                        </span>
                        <i
                            class="fas fa-trash"
                            @click.stop="onClickRemoveOption(index)"
                        ></i>
                    </li>
                </List>
            </Panel>
        </Transition>
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
import { onMounted, ref, watch } from 'vue';
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

onPaneReady((vueFlow) => {
    console.log('VueFlow instance ready', vueFlow);

    // Set the initial nodes and edges
    vueFlowInstance.value = vueFlow;
    vueFlowInstance.value?.setViewport({ x: 0, y: 0, zoom: 1 });

    // Listen for connect events to add edges
    vueFlowInstance.value?.onConnect((params) => {
        edges.value.push({
            id: `edge-${params.source}-${params.target}`,
            source: params.source,
            target: params.target,
            sourceHandle: params.sourceHandle,
            targetHandle: params.targetHandle // Same as target, presumably
        });

        // Set the nextDialogeId of the source dialogue to the target dialogue's id
        const dialogue = selectedScene.value?.dialogues.find(
            (dialogue) => dialogue.id === params.source
        );
        if (!dialogue) return;
        const option = dialogue.data.options.find(
            (option) => option.id === params.sourceHandle
        );
        if (!option) return;
        option.nextDialogueId = params.target;
        console.log('option', option);
    });

    // Select the first scene by default
    selectedScene.value = project!.value.scenes[0] || null;
});

// Watch selectedScene.id, load the correct nodes and edges
watch(() => selectedScene.value?.id, updateSelectedScene);

// Watch selectedDialogue label
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

function updateSelectedScene() {
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

function makeEdgesFromProject() {
    if (!selectedScene.value) return [];
    const edges: Edge[] = [];
    // TODO: Implement edges from project
    // Loop over each option in each dialogue and create an edge from it to its target (nextDialogueId)
    // If the nextDialogueId is null, skip it

    return edges;
}

function onClickAction() {
    // Update all node internals
    const allNodeIds =
        selectedScene.value?.dialogues.map((dialogue) => dialogue.id) || [];
    updateNodeInternals(allNodeIds);
}

function onClickOption(option: DialogueOption) {
    // TODO: Implement option click action
}

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

function onClickDialogue(dialogue: Dialogue) {
    if (!vueFlowInstance.value) return;
    selectedDialogue.value = dialogue;

    const node = vueFlowInstance.value.getNode(dialogue.id);
    setTimeout(() => {
        panToNode(node);
    }, 0);
}

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

    vueFlowInstance.value.getSelectedNodes.forEach((node) => {
        node.selected = false;
    });
    node.selected = true;
}

function onClickProjectSettings() {
    ModalController.open(SettingsModal, { project: project.value });
}

function onClickSceneSettings() {
    // TODO: Implement scene settings modal
}

function onClickDialogueClose() {
    if (!vueFlowInstance.value || !selectedDialogue.value) return;
    const selectedNode = vueFlowInstance.value.getNode(
        selectedDialogue.value?.id
    );
    if (!selectedNode) return;
    selectedNode.selected = false;
    selectedDialogue.value = null;
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

function onClickRemoveOption(index: number) {
    if (!selectedDialogue.value) return;
    selectedDialogue.value.data.options.splice(index, 1);

    // Update the node
    updateNode(selectedDialogue.value.id, {
        data: {
            ...selectedDialogue.value.data,
            options: selectedDialogue.value.data.options
        }
    });
}

function onClickHome() {
    router.push({ name: PageName.HOME });
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
        display: flex;
        justify-content: space-between;
        white-space: nowrap;
        overflow: hidden;
        > span {
            text-overflow: ellipsis;
            overflow: hidden;
            width: 100%;
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
