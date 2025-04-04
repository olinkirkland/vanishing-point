<template>
    <Card class="vue-flow__node-default" :class="{ dragging: props.dragging }">
        <div class="node-content">
            <p>{{ data.label }}</p>
            <pre>{{ x }}, {{ y }}</pre>
            <Handle type="source" :position="Position.Bottom" />
        </div>
    </Card>
</template>

<script setup lang="ts">
import Card from '@/components/ui/Card.vue';
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
    width: calc(16px * 12);
    height: calc(16px * 6);
}

// When dragging
.dragging {
    opacity: 0.5;
}
</style>
