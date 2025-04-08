<template>
    <Card
        class="vue-flow__node-default"
        :class="{ dragging: props.dragging, 'is-selected': props.selected }"
        :id="`node-${props.id}`"
    >
        <div class="node-content">
            <div class="node-content__header">
                <!-- Incoming Handle -->
                <Handle
                    :id="`handle-incoming-${props.id}`"
                    class="handle handle--incoming"
                    :position="Position.Left"
                    :type="'target'"
                    :isConnectable="true"
                />
            </div>
            <div class="node-content__body">
                <p>{{ props.data.label }}</p>
                <pre>{{ props.id }}</pre>
            </div>
        </div>

        <!-- Outgoing Handles -->
        <!-- TODO: Add a section & handle for each outgoing connection -->
        <ul class="options">
            <li v-for="(option, index) in props.data.options" :key="index">
                <p>{{ option.label }}</p>
                <Handle
                    :id="`handle-outgoing-${option.id}`"
                    class="handle handle--outgoing"
                    :position="Position.Right"
                    :type="'source'"
                    :isConnectable="true"
                />
            </li>
        </ul>
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
    padding: 0;
}

.node-content {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    width: 100%;

    .node-content__body {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        padding: 0.8rem 1.2rem;
        p {
            text-align: left;
            overflow: hidden;
            width: 100%;
        }
    }

    .node-content__header {
        position: relative;
        display: flex;
        width: 100%;
        height: 3.2rem;
        background-color: var(--color-surface);
        border-bottom: 1px solid var(--color-surface-alt);
        .handle {
            left: 1.6rem;
        }
    }
}

// When dragging
.dragging {
    opacity: 0.5;
    outline: none !important;
}

// When selected
.is-selected {
    // border: 1px solid var(--color-primary);
    outline: 1px solid var(--color-primary);
    outline-offset: 1px;
}

ul.options {
    margin-top: auto;
    background-color: var(--color-surface);
    width: 100%;

    display: flex;
    flex-direction: column;

    li {
        padding: 0.8rem 1.2rem;
        border-top: 1px solid var(--color-surface-alt);
        position: relative;

        p {
            width: 100%;
            text-align: left;
        }

        > .handle {
            right: 1.6rem;
        }
    }
}

.vue-flow__handle.handle {
    border-radius: 50%;
    width: 1.6rem;
    height: 1.6rem;
    background-color: var(--color-background);
    border: 1px solid var(--color-surface-alt);
    position: absolute;
    transition: all 0.2s ease-in-out;

    &.connectable {
        cursor: pointer;
    }
}
</style>
