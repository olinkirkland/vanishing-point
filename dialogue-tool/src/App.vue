<template>
    <VueFlow
        :nodes="scene?.dialogues"
        :edges="edges"
        :snap-to-grid="true"
        :snap-grid="[16, 16]"
        :ref="vueFlowRef"
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
        <!-- Background is dots spaced by 16px, offset 0 -->
        <Background :gap="16" :offset="0" />
    </VueFlow>
    <div class="controls">
        <button @click="resetViewport">Reset stage X and Y positions</button>
        <Card>
            <pre>{{ JSON.stringify(scene, null, 2) }}</pre>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { Background } from '@vue-flow/background';
import { useVueFlow, VueFlow, VueFlowStore } from '@vue-flow/core';
import { computed, onMounted, ref, watch } from 'vue';

import Card from './components/Card.vue';
import DialogueNode from './components/DialogueNode.vue';
import SpecialEdge from './components/SpecialEdge.vue';
import sampleScene from './sample-scene.json';
import Scene from './scene';

const scene = ref<Scene>();

onMounted(() => {
    // Load the scene from localstorage or create a new scene
    const savedScene = localStorage.getItem('scene');
    scene.value = new Scene().load(
        JSON.parse(savedScene ?? JSON.stringify(sampleScene))
    );
});

const vueFlowInstance = ref<VueFlowStore | null>(null);
const { onPaneReady } = useVueFlow();
onPaneReady((vueFlow) => {
    vueFlowInstance.value = vueFlow;
    vueFlowInstance.value?.fitView();
});

watch(
    scene,
    () => {
        localStorage.setItem('scene', JSON.stringify(scene.value?.save()));
    },
    { deep: true }
);

const edges = computed(() => []);
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

function resetViewport() {
    vueFlowInstance.value?.fitView();
}
</script>

<style lang="scss">
@use 'assets/scss/reset.scss';
@use 'assets/scss/styles.scss';
@use 'assets/scss/variables.scss';
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';

.vue-flow {
    height: 100vh;
}

.controls {
    position: fixed;
    top: 0;
    right: 0;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
