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
        <div class="btn__shadow"></div>
        <div class="btn__content"><slot></slot></div>
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
button {
    position: relative;
    background-color: transparent;
}

.btn__content {
    position: relative;
    top: -0.2rem;
    display: flex;
    gap: 0.8rem;
    align-items: center;
    height: 4rem;
    padding: 0 1.6rem;
    border-radius: 5px;
    background-color: var(--color-background);
    border: 1px solid var(--color-surface-alt);
    cursor: pointer;
    transition: all 0.1s ease-in-out;

    &:active {
        transition: unset;
        filter: brightness(0.95);
        top: 0;
    }
}

.btn__shadow {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: var(--color-surface-alt);
}

// Primary button
.btn--primary {
    .btn__content {
        background-color: var(--color-primary);
        border: 1px solid var(--color-primary-alt);
        * {
            color: var(--color-background);
        }
    }
    .btn__shadow {
        background-color: var(--color-primary-alt);
    }
}

// Icon-only button
.btn.btn--icon {
    .btn__content {
        background-color: transparent;
        border: none;
        top: 0;
    }
    .btn__shadow {
        background-color: transparent;
    }
}

// Disabled
.btn--disabled {
    opacity: 0.4;
    pointer-events: none;
    border: none;
}
</style>
