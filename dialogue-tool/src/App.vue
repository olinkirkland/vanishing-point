<template>
    <VueFlow
        :nodes="scene?.dialogues"
        :edges="edges"
        :snap-to-grid="true"
        :snap-grid="[16, 16]"
    >
        <template
            #node-dialogue="dialogueNodeProps"
            v-on:drag="dialogueNodeProps.onDrag"
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
        <pre>{{ JSON.stringify(scene, null, 2) }}</pre>
    </div>
</template>

<script setup lang="ts">
import { Background } from '@vue-flow/background';
import { VueFlow } from '@vue-flow/core';
import { computed, onMounted, ref, watch } from 'vue';

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

watch(
    scene,
    () => {
        localStorage.setItem('scene', JSON.stringify(scene.value?.save()));
    },
    { deep: true }
);

const edges = computed(() => []);

// const edges = ref<Edge[]>([
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
