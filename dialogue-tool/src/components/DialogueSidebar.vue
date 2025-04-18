<template>
    <!-- Dialogue Panel -->
    <Transition name="sidebar-transition">
        <Panel class="sidebar sidebar--right" v-if="selectedDialogue">
            <div class="sidebar__header">
                <h2>Dialogue</h2>
                <div class="f">
                    <Button @click="onClickPanToDialogue" icon>
                        <i class="fas fa-crosshairs"></i>
                    </Button>
                    <Button @click="onClickCloseDialogue" icon>
                        <i class="fas fa-times"></i>
                    </Button>
                </div>
            </div>

            <InputGroup
                v-model="selectedDialogue.data.label"
                placeholder="Project name"
            >
                <span>Label</span>
            </InputGroup>

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
                    v-for="option in selectedDialogue?.data.options"
                    :key="option.id"
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
                        <Button @click.stop="onClickRemoveOption(option.id)">
                            <i class="fas fa-trash"></i>
                            <span>Delete</span>
                        </Button>
                        <Button
                            @click.stop="onClickUnlinkOption(option.id)"
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
</template>

<script setup lang="ts">
import Dialogue, { DialogueOption } from '@/dialogue';
import Project from '@/project';
import Scene from '@/scene';
import { useProjectsStore } from '@/store/projects-store';
import { v4 as uuid } from 'uuid';
import InputGroup from './ui/InputGroup.vue';

const props = defineProps<{
    project: Project;
    selectedScene: Scene;
    selectedDialogue: Dialogue | null;
}>();

const emit = defineEmits<{
    (e: 'panToDialogue', id: string): void;
    (e: 'deselectDialogue'): void;
}>();

const projectStore = useProjectsStore();

function onClickCloseDialogue() {
    emit('deselectDialogue');
}

function onClickPanToDialogue() {
    if (!props.selectedDialogue) return;
    emit('panToDialogue', props.selectedDialogue.id);
}

function onClickAddOption() {
    if (!props.selectedDialogue) return;
    const newOption: DialogueOption = {
        id: uuid(),
        label: 'New Option',
        nextDialogueId: null,
        condition: null
    };

    projectStore.addOption(
        props.project.id,
        props.selectedScene?.id,
        props.selectedDialogue.id,
        newOption
    );
}

function onClickRemoveOption(id: string) {
    if (!props.selectedDialogue) return;
    // TODO: Remove edge

    projectStore.removeOption(
        props.project.id,
        props.selectedScene?.id,
        props.selectedDialogue.id,
        id
    );
}

function onClickUnlinkOption(id: string) {
    if (!props.selectedDialogue) return;
    // TODO: Remove edge
}

function onClickRemoveSelectedDialogue() {
    if (!props.selectedDialogue) return;
    emit('deselectDialogue');
    projectStore.removeDialogue(
        props.project.id,
        props.selectedScene?.id,
        props.selectedDialogue.id
    );
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
    border-bottom: 1px solid var(--color-surface-alt);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.8rem;

    &:not(:last-child) {
        margin-bottom: 2.4rem;
    }
}

:deep(ul.options) {
    min-height: 40rem;

    > li {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.4rem;
        cursor: unset;

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
