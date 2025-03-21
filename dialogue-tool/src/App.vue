<template>
    <VueFlow :nodes="nodes" :edges="edges">
        <template #node-special="specialNodeProps">
            <SpecialNode v-bind="specialNodeProps" />
        </template>
        <template #edge-special="specialEdgeProps">
            <SpecialEdge v-bind="specialEdgeProps" />
        </template>
    </VueFlow>
    <div class="controls">
        <pre>{{ JSON.stringify(scene, null, 2) }}</pre>
    </div>
</template>

<script setup lang="ts">
import type { Edge, Node } from '@vue-flow/core';
import { VueFlow } from '@vue-flow/core';
import { onMounted, ref, watch } from 'vue';

import SpecialEdge from './components/SpecialEdge.vue';
import SpecialNode from './components/SpecialNode.vue';
import Scene from './scene';
import sampleScene from './sample-scene.json';

const scene = ref<Scene>();
onMounted(() => {
    // Load the scene from localstorage or create a new scene
    const savedScene = localStorage.getItem('scene');
    scene.value = new Scene().load(
        JSON.parse(savedScene ?? JSON.stringify(sampleScene))
    );
});

watch(scene, () => {
    localStorage.setItem('scene', JSON.stringify(scene.value?.save()));
});

const nodes = ref<Node[]>([
    {
        id: '1',
        type: 'input',
        position: { x: 250, y: 5 },
        data: { label: 'Node 1' }
    },
    {
        id: '2',
        position: { x: 100, y: 100 },
        data: { label: 'Node 2' }
    },
    {
        id: '3',
        type: 'output',
        position: { x: 400, y: 200 },
        data: { label: 'Node 3' }
    },
    {
        id: '4',
        type: 'special',
        position: { x: 400, y: 200 },
        data: {
            label: 'Node 4',
            hello: 'world'
        }
    }
]);

const edges = ref<Edge[]>([
    {
        id: 'e1->2',
        source: '1',
        target: '2'
    },
    {
        id: 'e2->3',
        source: '2',
        target: '3',
        animated: true
    },
    {
        id: 'e3->4',
        type: 'special',
        source: '3',
        target: '4',
        data: {
            hello: 'world'
        }
    }
]);
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
