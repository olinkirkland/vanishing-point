<template>
    <!-- Left Sidebar -->
    <Panel class="sidebar sidebar--left">
        <section class="sidebar__project">
            <div class="flex">
                <Button @click="router.push({ name: PageName.HOME })">
                    <i class="fas fa-chevron-left"></i>
                    <span>Home</span>
                </Button>
            </div>
            <div class="sidebar__header">
                <h2>{{ project.name }}</h2>
                <Button @click="onClickOpenProjectSettings" icon>
                    <i class="fas fa-edit"></i>
                </Button>
            </div>
            <p v-if="project.description">{{ project.description }}</p>
            <p v-else><em> No description yet. </em></p>
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
                    @click="onClickSelectScene(scene)"
                    :class="{
                        'is-selected': selectedScene?.id === scene.id
                    }"
                >
                    <i class="fas fa-layer-group"></i>
                    <div class="full-width flex spread">
                        <span>{{ scene.name }}</span>
                        <span class="muted">{{ scene.dialogues.length }}</span>
                    </div>
                </li></List
            >
        </section>
        <section class="sidebar__scene" v-if="selectedScene">
            <div class="sidebar__header">
                <h2>{{ selectedScene.name }}</h2>
                <Button @click="onClickOpenSceneSettings" icon>
                    <i class="fas fa-edit"></i>
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
                    @click="onClickSelectDialogue(dialogue)"
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
</template>

<script setup lang="ts">
import ModalController from '@/controllers/modal-controller';
import Dialogue from '@/dialogue';
import Project from '@/project';
import { PageName, router } from '@/router';
import Scene from '@/scene';
import { useProjectsStore } from '@/store/projects-store';
import ProjectSettingsModal from './modals/templates/ProjectSettingsModal.vue';
import SceneSettingsModal from './modals/templates/SceneSettingsModal.vue';

const props = defineProps<{
    project: Project;
    selectedScene: Scene | null;
    selectedDialogue: Dialogue | null;
}>();

const emit = defineEmits<{
    (e: 'selectScene', scene: Scene): void;
    (e: 'selectDialogue', dialogue: Dialogue): void;
}>();

const projectsStore = useProjectsStore();

function onClickOpenProjectSettings() {
    ModalController.open(ProjectSettingsModal, { project: props.project });
}

function onClickOpenSceneSettings() {
    ModalController.open(SceneSettingsModal, {
        project: props.project,
        scene: props.selectedScene
    });
}

function onClickAddScene() {
    const newScene = new Scene('Untitled Scene', 'Lorem ipsum dolor sit amet.');
    projectsStore.addScene(props.project.id, newScene);
}

function onClickAddDialogue() {
    if (!props.selectedScene) return;
    const newDialogue = new Dialogue();
    projectsStore.addDialogue(
        props.project.id,
        props.selectedScene.id,
        newDialogue
    );
}

function onClickSelectScene(scene: Scene) {
    emit('selectScene', scene);
}

function onClickSelectDialogue(dialogue: Dialogue) {
    emit('selectDialogue', dialogue);
}
</script>

<style scoped lang="scss">
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

section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.8rem;

    &:not(:last-child) {
        margin-bottom: 2.4rem;
    }
}

.sidebar__scene {
    flex: 1;
    overflow: hidden;
}

:deep(ul.scenes) {
    max-height: 20rem;
}

:deep(ul.dialogue) {
    flex: 1;
}
</style>
