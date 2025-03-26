<template>
    <button class="btn" :class="{ 'btn--icon': icon, 'btn--primary': primary }">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    icon: Boolean,
    primary: Boolean
});
</script>

<style lang="scss" scoped>
button.btn {
    display: flex;
    align-items: center;
    height: 3.2rem;
    padding: 0 1.6rem;
    border-radius: 5px;
    background-color: var(--color-surface);
    box-shadow: var(--shadow-sm);
    cursor: pointer;

    &:active {
        filter: brightness(0.95);
        box-shadow: none;
    }

    &.btn--icon {
        padding: 0;
        background-color: transparent;
        display: flex;
        justify-content: center;
        width: 3.2rem;
        height: 3.2rem;
        border: none;
        box-shadow: none;
    }

    &.btn--primary {
        background-color: var(--color-primary);
        * {
            color: var(--color-surface);
        }
    }
}
</style>
