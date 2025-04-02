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
    gap: 0.8rem;
    align-items: center;
    height: 4rem;
    padding: 0 1.6rem;
    border-radius: 5px;
    background-color: var(--color-background);
    border: 1px solid var(--color-surface-alt);
    box-shadow: var(--shadow-sm);
    cursor: pointer;

    border-bottom: 0.4rem solid var(--color-surface-alt);

    &:active {
        filter: brightness(0.95);
        box-shadow: none;
        border-bottom: 1px solid var(--color-surface-alt);
    }

    &.btn--primary {
        background-color: var(--color-primary);
        border-color: var(--color-primary-alt);
        * {
            color: var(--color-background);
        }

        &:active {
            border-bottom: 1px solid var(--color-primary-alt);
        }
    }

    &.btn--icon {
        padding: 0;
        background-color: transparent;
        display: flex;
        justify-content: center;
        width: 4rem;
        height: 4rem;
        border: none;
        box-shadow: none;
    }
}
</style>
