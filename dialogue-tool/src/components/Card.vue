<template>
    <div class="card">
        <slot></slot>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.card {
    border-radius: 5px;
    background-color: var(--color-surface-light);
    border: 1px solid var(--color-surface);
    box-shadow: var(--shadow-sm);
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
