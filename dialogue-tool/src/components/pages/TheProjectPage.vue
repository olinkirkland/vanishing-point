<template>
    <div v-if="project" class="page page--project">
        <VueFlow
            :nodes="nodes"
            :edges="edges"
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
            <h3>{{ project.name }}</h3>
            <p>{{ project.description }}</p>
            <div class="flex">
                <Badge color="var(--color-surface-alt)" :useLightText="true">
                    <span
                        >Created
                        {{ new Date(project.createdAt).toLocaleDateString() }}
                    </span>
                </Badge>
                <Badge color="var(--color-surface-alt)" :useLightText="true">
                    <span
                        >Modified
                        {{
                            new Date(project.updatedAt).toLocaleDateString()
                        }}</span
                    >
                </Badge>
            </div>
            <pre>{{ projectId }}</pre>
            <div class="flex wrap">
                <Button @click="onClickHome">
                    <i class="fas fa-home"></i>
                    <span>Home</span>
                </Button>
                <Button @click="onClickRemove">
                    <i class="fas fa-trash"></i>
                    <span>Delete</span>
                </Button>
                <Button @click="resetViewport">
                    <i class="fas fa-arrows-alt"></i>
                    <span>Reset Viewport</span>
                </Button>
                <Button @click="addNode">
                    <i class="fas fa-plus"></i>
                    <span>Add Node</span>
                </Button>
            </div>
            <pre>{{ JSON.stringify(nodes, null, 2) }}</pre>
        </Panel>
    </div>
</template>

<script setup lang="ts">
import DialogueNode from '@/components/flow/DialogueNode.vue';
import SpecialEdge from '@/components/flow/SpecialEdge.vue';
import ConfirmModal from '@/components/modals/templates/ConfirmModal.vue';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Panel from '@/components/ui/Panel.vue';
import ModalController from '@/controllers/modal-controller';
import { t } from '@/i18n/locale';
import Project from '@/project';
import { PageName, router } from '@/router';
import { useProjectsStore } from '@/store/projects-store';
import { Background } from '@vue-flow/background';
import { Node, useVueFlow, VueFlow, VueFlowStore } from '@vue-flow/core';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const { onPaneReady, toObject, fromObject } = useVueFlow();

const route = useRoute();
const projectsStore = useProjectsStore();
const projectId = ref<string | null>((route.params.id as string) || null);
const project = ref<Project | null>(
    projectsStore.getProjectById(projectId.value as string) || null
);

const vueFlowInstance = ref<VueFlowStore | null>(null);
const nodes = ref<Node[]>([]);
const edges = computed(() => []);

onMounted(() => {
    if (project.value?.flow) fromObject(project.value?.flow);
});

onPaneReady((vueFlow) => {
    vueFlowInstance.value = vueFlow;
    vueFlowInstance.value?.setViewport({ x: 0, y: 0, zoom: 1 });
});

function addNode() {
    const id = Date.now().toString();
    nodes.value.push({
        id,
        type: 'dialogue',
        data: { label: `Node ${id}` },
        position: { x: Math.random() * 100, y: Math.random() * 100 },
        style: { width: 200, height: 100 }
    });
}

function resetViewport() {
    // Move to 0, 0 at zoom 1
    vueFlowInstance.value?.setViewport(
        { x: 0, y: 0, zoom: 1 },
        { duration: 500 }
    );
}

function onClickHome() {
    router.push({ name: PageName.HOME });
}

function onClickRemove() {
    ModalController.open(ConfirmModal, {
        title: t('UI.Modals.Delete-project.title'),
        message: t('UI.Modals.Delete-project.message'),
        confirmText: t('UI.Modals.Delete-project.Controls.confirm'),
        cancelText: t('UI.Modals.Delete-project.Controls.cancel'),
        isConfirmButtonCta: true,
        onConfirm: () => {
            projectsStore.removeProjectById(projectId.value as string);
            router.push({ name: PageName.HOME });
            ModalController.close();
        },
        onCancel: () => {
            ModalController.close();
        }
    });
}
</script>

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
    overflow-y: auto;
}
</style>
