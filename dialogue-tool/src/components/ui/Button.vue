<template>
    <button
        class="btn"
        :class="{
            'btn--icon': icon,
            'btn--primary': primary,
            'btn--disabled': disabled
        }"
        :disabled="disabled"
    >
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    icon: Boolean,
    primary: Boolean,
    disabled: Boolean
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
    cursor: pointer;

    border-bottom: 0.4rem solid var(--color-surface-alt);

    &:active {
        filter: brightness(0.95);
        box-shadow: none;
        border-bottom: 1px solid var(--color-surface-alt);
    }
}

// Primary button
.btn.btn--primary {
    background-color: var(--color-primary);
    border-color: var(--color-primary-alt);
    * {
        color: var(--color-background);
    }

    &:active {
        border-bottom: 1px solid var(--color-primary-alt);
    }
}

// Icon-only button
.btn.btn--icon {
    padding: 0;
    background-color: transparent;
    display: flex;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    border: none;
    box-shadow: none;
}

// Disabled
.btn.btn--disabled {
    opacity: 0.4;
    pointer-events: none;
    box-shadow: none;
    border: none;
}
</style>
