<template>
    <div class="app-layout">
        <div class="controls">
            <button @click="resetViewport">Reset Viewport</button>
            <pre>{{ JSON.stringify(scene, null, 2) }}</pre>
        </div>
        <VueFlow
            :nodes="scene?.dialogues"
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
    </div>
</template>

<script setup lang="ts">
import { Background } from '@vue-flow/background';
import type { VueFlowStore } from '@vue-flow/core';
import { useVueFlow, VueFlow } from '@vue-flow/core';
import { computed, onMounted, ref, watch } from 'vue';
import DialogueNode from './components/flow/DialogueNode.vue';
import SpecialEdge from './components/flow/SpecialEdge.vue';
import initialNodes from './sample-scene.json';
import Scene from './scene';

const { onPaneReady, toObject, fromObject } = useVueFlow();

const SAVE_KEY = 'save/untitled-scene';

const scene = ref<Scene>();
const edges = computed(() => []);

onMounted(() => {
    // Load the scene from localstorage or create a new scene
    const savedScene = localStorage.getItem(SAVE_KEY);
    scene.value = new Scene().load(
        JSON.parse(savedScene ?? JSON.stringify(initialNodes))
    );
});

//     {
//         id: 'e1->2',
//         source: '1',
//         target: '2'
//     },
//     {
//         id: 'e2->3',
//         source: '2',
//         target: '3',
//         animated: true
//     },
//     {
//         id: 'e3->4',
//         type: 'special',
//         source: '3',
//         target: '4',
//         data: {
//             hello: 'world'
//         }
//     }
// ]);

const vueFlowInstance = ref<VueFlowStore | null>(null);

onPaneReady((vueFlow) => {
    vueFlowInstance.value = vueFlow;
    vueFlowInstance.value?.setViewport({ x: 0, y: 0, zoom: 1 });
});

function resetViewport() {
    // Move to 0, 0 at zoom 1
    vueFlowInstance.value?.setViewport(
        { x: 0, y: 0, zoom: 1 },
        { duration: 500 }
    );
}

// When the scene changes, save it to localstorage
watch(
    scene,
    () => {
        localStorage.setItem('scene', JSON.stringify(scene.value?.save()));
    },
    { deep: true }
);
</script>

<style lang="scss">
@use 'assets/scss/reset.scss';
@use 'assets/scss/styles.scss';
@use 'assets/scss/variables.scss';
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

.app-layout {
    display: flex;
    width: 100vw;
    height: 100vh;
}

.controls {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
