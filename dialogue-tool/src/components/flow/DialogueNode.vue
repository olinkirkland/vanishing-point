<template>
    <Card
        class="vue-flow__node-default"
        :class="{ dragging: props.dragging }"
        :id="`node-${props.id}`"
    >
        <div class="node-content">
            <p>{{ props.id }}</p>
            <pre>{{ x }}, {{ y }}</pre>
            <Handle type="source" :position="Position.Bottom" />
        </div>
    </Card>
</template>

<script setup lang="ts">
import Card from '@/components/ui/Card.vue';
import type { NodeProps } from '@vue-flow/core';
import { Handle, Position } from '@vue-flow/core';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<NodeProps>();
const adjustedHeight = ref<Number>(0);

onMounted(() => {
    adjustHeight();
});

function adjustHeight() {
    const node = document.getElementById(`node-${props.id}`);
    if (!node) return console.error('Node not found');
    // This is to ensure the node looks good on the background grid
    // and to avoid any weirdness with the grid snapping
    const height = node.offsetHeight;
    if (height % 16 == 0) return;
    const heightAsMultiplesOf16 = Math.floor(height / 16) * 16;
    adjustedHeight.value = heightAsMultiplesOf16 + 16;
    node.style.height = `${adjustedHeight.value}px`;
}

const x = computed(() => `${Math.round(props.position.x)}px`);
const y = computed(() => `${Math.round(props.position.y)}px`);
</script>

<style lang="scss" scoped>
.vue-flow__node-default {
    width: calc(16px * 16);
}

.node-content {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    width: 100%;
    p {
        text-align: left;
        overflow: hidden;
        width: 100%;
    }
}

// When dragging
.dragging {
    opacity: 0.5;
}
</style>
