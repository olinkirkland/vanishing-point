<template>
    <div v-if="project" class="page page--project">
        <VueFlow
            :nodes="initialNodes"
            :edges="initialEdges"
            :snap-to-grid="true"
            :snap-grid="[16, 16]"
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
        <Panel class="sidebar">
            <section class="sidebar__project">
                <div class="flex">
                    <Button @click="onClickHome">
                        <i class="fas fa-chevron-left"></i>
                        <span>Home</span>
                    </Button>
                    <Button @click="onClickSettings">
                        <i class="fas fa-cog"></i>
                        <span>Project Settings</span>
                    </Button>
                </div>
                <div class="sidebar__header">
                    <h2>Project</h2>
                </div>
                <p>
                    <strong>{{ project.name }}</strong>
                </p>
                <p>{{ project.description }}</p>
                <div class="flex">
                    <Badge
                        color="var(--color-surface-alt)"
                        :useLightText="true"
                    >
                        <span
                            >Created
                            {{
                                new Date(project.createdAt).toLocaleDateString()
                            }}
                        </span>
                    </Badge>
                    <Badge
                        color="var(--color-surface-alt)"
                        :useLightText="true"
                    >
                        <span
                            >Modified
                            {{
                                new Date(project.updatedAt).toLocaleDateString()
                            }}</span
                        >
                    </Badge>
                </div>
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
                </div>
                <p>
                    <strong>{{ selectedScene.name }}</strong>
                </p>
                <p>{{ selectedScene.description }}</p>
                <Button @click="onClickAddMoment" full-width>
                    <i class="fas fa-plus"></i>
                    <span>Add Moment</span>
                </Button>
                <List class="moments">
                    <li v-if="selectedScene?.moments.length === 0">
                        <em>No moments yet.</em>
                    </li>
                    <li
                        v-for="moment in selectedScene?.moments"
                        :key="moment.id"
                    >
                        <i class="fas fa-comment-alt"></i>
                        <span
                            ><em>{{ moment.id.substring(0, 8) }}</em></span
                        >
                    </li></List
                >
            </section>
            <!-- <pre>{{ JSON.stringify(project, null, 2) }}</pre> -->
        </Panel>
    </div>
</template>

<script setup lang="ts">
import DialogueNode from '@/components/flow/DialogueNode.vue';
import SpecialEdge from '@/components/flow/SpecialEdge.vue';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Panel from '@/components/ui/Panel.vue';
import ModalController from '@/controllers/modal-controller';
import Moment from '@/moment';
import Project from '@/project';
import { PageName, router } from '@/router';
import Scene from '@/scene';
import { useProjectsStore } from '@/store/projects-store';
import { Background } from '@vue-flow/background';
import { Edge, Node, useVueFlow, VueFlow, VueFlowStore } from '@vue-flow/core';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import SettingsModal from '../modals/templates/SettingsModal.vue';
import List from '../ui/List.vue';

const { onPaneReady, toObject, fromObject, addNodes } = useVueFlow();

const route = useRoute();
const projectsStore = useProjectsStore();
const projectId = ref<string | null>((route.params.id as string) || null);
const project = ref<Project | null>(
    projectsStore.getProjectById(projectId.value as string) || null
);

const vueFlowInstance = ref<VueFlowStore | null>(null);
const selectedScene = ref<Scene | null>(null);
const initialNodes = ref<Node[]>([]);
const initialEdges = ref<Edge[]>([]);

onPaneReady((vueFlow) => {
    vueFlowInstance.value = vueFlow;
    vueFlowInstance.value?.setViewport({ x: 0, y: 0, zoom: 1 });
});

function onClickSettings() {
    ModalController.open(SettingsModal, { project: project.value });
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
    justify-content: flex-start;
    align-items: flex-start;
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
    padding: 0.4rem 0.8rem;
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
