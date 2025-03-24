<template>
    <div class="vue-flow__node-default" :class="{ dragging: props.dragging }">
        <p>{{ data.label }}</p>
        <pre>{{ x }}, {{ y }}</pre>
        <Handle type="source" :position="Position.Bottom" />
    </div>
</template>

<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core';
import { Handle, Position } from '@vue-flow/core';
import { computed, watch } from 'vue';

const props = defineProps<NodeProps>();

watch(
    () => props.position,
    () => {
        console.log('Position changed');
        console.log(props);
    }
);

const x = computed(() => `${Math.round(props.position.x)}px`);
const y = computed(() => `${Math.round(props.position.y)}px`);
</script>

<style lang="scss" scoped>
.vue-flow__node-default {
    // width in multiples of 16
    width: calc(16px * 12);
    height: calc(16px * 6);
    background-color: var(--color-surface-very-light);
    border: 1px solid var(--color-surface);
    border-radius: 5px;
    box-shadow: none;
}

// When dragging
.dragging {
    box-shadow: var(--shadow-sm);
    opacity: 0.5;
}
</style>
