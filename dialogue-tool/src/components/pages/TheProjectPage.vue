<template>
    <div v-if="project" class="page page--project">
        <VueFlow
            :nodes="nodes"
            :edges="edges"
            :snap-to-grid="true"
            :snap-grid="[16, 16]"
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
                    <h2>Project</h2>
                    <Button @click="onClickProjectSettings" icon>
                        <i class="fas fa-cog"></i>
                    </Button>
                </div>
                <p>
                    <strong>{{ project.name }}</strong>
                </p>
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
                    <h2>Scene</h2>
                    <Button @click="onClickSceneSettings" icon>
                        <i class="fas fa-cog"></i>
                    </Button>
                </div>
                <p>
                    <strong>{{ selectedScene.name }}</strong>
                </p>
                <p>{{ selectedScene.description }}</p>
                <Button @click="onClickAddMoment" full-width>
                    <i class="fas fa-plus"></i>
                    <span>Add Dialogue</span>
                </Button>
                <List class="moments">
                    <li v-if="selectedScene?.moments.length === 0">
                        <em>No dialogues yet.</em>
                    </li>
                    <li
                        v-for="moment in selectedScene?.moments"
                        :key="moment.id"
                        @click="onClickMoment(moment)"
                    >
                        <i class="fas fa-comment-dots"></i>
                        <span>
                            <em>{{ moment.id.substring(0, 8) }}</em>
                        </span>
                    </li>
                </List>
                <Button @click="onClickAction" full-width>
                    <i class="fas fa-play"></i>
                    <span>Perform Action</span>
                </Button>
            </section>
        </Panel>
        <!-- Moment Panel -->
        <Transition name="sidebar-transition">
            <Panel class="sidebar sidebar--right" v-if="selectedMoment">
                <div class="sidebar__header">
                    <h2>Dialogue</h2>
                    <Button @click="onClickDialogueClose" icon>
                        <i class="fas fa-times"></i>
                    </Button>
                </div>
                <pre>{{ selectedMoment }}</pre>
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
import Moment from '@/moment';
import Project from '@/project';
import { PageName, router } from '@/router';
import Scene from '@/scene';
import { useProjectsStore } from '@/store/projects-store';
import { Background } from '@vue-flow/background';
import {
    Edge,
    GraphNode,
    Node,
    useVueFlow,
    VueFlow,
    VueFlowStore
} from '@vue-flow/core';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import SettingsModal from '../modals/templates/ProjectSettingsModal.vue';
import List from '../ui/List.vue';

const { onPaneReady, toObject, addNodes, updateNodeInternals } = useVueFlow();

const route = useRoute();
const projectsStore = useProjectsStore();
const projectId = ref<string | null>((route.params.id as string) || null);
const project = ref<Project | null>(
    projectsStore.getProjectById(projectId.value as string) || null
);

const vueFlowInstance = ref<VueFlowStore | null>(null);
const selectedScene = ref<Scene | null>(null);
const selectedMoment = ref<Moment | null>(null);
const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);

onPaneReady((vueFlow) => {
    vueFlowInstance.value = vueFlow;
    vueFlowInstance.value?.setViewport({ x: 0, y: 0, zoom: 1 });
    listenToFlowChanges();
});

// When selectedScene.id changes, update the nodes and edges
watch(() => selectedScene.value?.id, updateSelectedScene);

function listenToFlowChanges() {
    // Listen for changes to the nodes
    vueFlowInstance.value?.onNodesChange((changes) => {
        changes.forEach((change) => {
            // When selection change happens, change selectedMoment
            console.log(change);
            switch (change.type) {
                case 'select':
                    if (!change.selected) {
                        selectedMoment.value = null;
                        return;
                    }

                    const selectedNode = vueFlowInstance.value?.getNode(
                        change.id
                    );
                    if (!selectedNode) return;

                    const moment = selectedScene.value?.moments.find(
                        (moment) => moment.id === selectedNode.id
                    );
                    if (!moment) return;
                    setTimeout(() => {
                        // setTimeout here is to ensure the node is selected before we set the selectedMoment
                        // Multiple changes can happen at once, and we want to ensure the selectedMoment is set after the node is selected
                        selectedMoment.value = moment;
                    }, 0);
                    break;
                default:
                    break;
            }
        });
    });
}

function updateSelectedScene() {
    if (!selectedScene.value) nodes.value = [];
    else nodes.value = selectedScene.value.moments;
}

function onClickAction() {
    // Update all node internals
    const allNodeIds =
        selectedScene.value?.moments.map((moment) => moment.id) || [];
    updateNodeInternals(allNodeIds);
}

function onNodesChange() {
    saveProject();
}

function saveProject() {
    if (!project.value) return;
    const projectObject = toObject();
    project.value.scenes.forEach((scene) => {
        scene.moments.forEach((moment) => {
            const node = projectObject.nodes.find(
                (node) => node.id === moment.id
            );
            if (node) {
                moment.position = node.position;
                moment.data = node.data;
            }
        });
    });
}

function onClickMoment(moment: Moment) {
    if (!vueFlowInstance.value) return;
    selectedMoment.value = moment;

    const node = vueFlowInstance.value.getNode(moment.id);
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
    if (!vueFlowInstance.value || !selectedMoment.value) return;
    const selectedNode = vueFlowInstance.value.getNode(
        selectedMoment.value?.id
    );
    if (!selectedNode) return;
    selectedNode.selected = false;
    selectedMoment.value = null;
}

function onClickAddScene() {
    const newScene = new Scene('Untitled Scene', 'Lorem ipsum dolor sit amet.');
    project.value?.scenes.push(newScene);
}

function onClickAddMoment() {
    const newMoment = new Moment();
    selectedScene.value?.moments.push(newMoment);

    addNodes([
        {
            id: newMoment.id,
            type: 'dialogue',
            data: { label: `Node ${newMoment.id}` },
            position: { x: 16 * 24, y: 16 * 4 }
        }
    ]);
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

:deep(ul.moments) {
    flex: 1;
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
