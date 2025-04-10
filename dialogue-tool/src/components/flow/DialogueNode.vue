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
                    :id="props.id"
                    class="handle handle--incoming"
                    :position="Position.Left"
                    :type="'target'"
                    :class="{
                        connected: props.data.prevDialogueIds.length > 0
                    }"
                />
                <p>{{ props.id }}</p>
            </div>
            <div class="node-content__body">
                <p>{{ props.data.label }}</p>
                <div class="flex">
                    <i class="fas fa-code-branch"></i>
                    <p>{{ props.data.prevDialogueIds.length }}</p>
                </div>
            </div>
        </div>

        <!-- Outgoing Handles -->
        <ul class="options">
            <li v-for="(option, index) in props.data.options" :key="index">
                <p>{{ option.label }}</p>
                <p>{{ option.id }}</p>
                <Handle
                    :id="option.id"
                    class="handle handle--outgoing"
                    :class="{ connected: option.nextDialogueId }"
                    :position="Position.Right"
                    :type="'source'"
                />
            </li>
        </ul>
    </Card>
</template>

<script setup lang="ts">
import Card from '@/components/ui/Card.vue';
import DialogueNodeProps from '@/dialogue-node-props';
import { Handle, Position } from '@vue-flow/core';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<DialogueNodeProps>();
const adjustedHeight = ref<Number>(0);

onMounted(() => {
    updateHeight();
});

watch(
    () => props.data.options,
    () => {
        // Wait for one frame to ensure the DOM is updated before calculating the height
        requestAnimationFrame(() => {
            updateHeight();
        });
    },
    { deep: true }
);

function updateHeight() {
    const node = document.getElementById(`node-${props.id}`);
    if (!node) return console.error('Node not found');
    // Force the height to be whatever the auto height is
    // and then adjust it to be a multiple of 16px
    node.style.height = 'auto';

    // This is to ensure the node looks good on the background grid
    // and to avoid any weirdness with the grid snapping
    const height = node.offsetHeight;
    if (height % 16 == 0) return;
    const heightAsMultiplesOf16 = Math.floor(height / 16) * 16;
    adjustedHeight.value = heightAsMultiplesOf16 + 16;
    node.style.height = `${adjustedHeight.value}px`;
}
</script>

<style lang="scss" scoped>
.vue-flow__node-default {
    width: calc(16px * 16);
    padding: 0;
}

.card {
    overflow: hidden;
    border-color: var(--color-on-surface);
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
        background-color: var(--color-on-surface-alt);
        border-bottom: 1px solid var(--color-on-surface);
        color: var(--color-background);
        align-items: center;
        p {
            text-align: left;
            margin-left: 3.4rem;
            margin-right: 0.8rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: inherit;
        }

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
    outline: 1px solid var(--color-primary);
    outline-offset: 0.5rem;
}

ul.options {
    margin-top: auto;
    background-color: var(--color-on-surface-alt);
    width: 100%;

    display: flex;
    flex-direction: column;
    color: var(--color-background);
    * {
        color: inherit;
    }

    li {
        padding: 0.8rem 1.2rem;
        border-top: 1px solid var(--color-on-surface);
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

    &.connected::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--color-primary);
    }
}
</style>
