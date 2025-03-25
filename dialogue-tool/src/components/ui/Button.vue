<template>
    <button>
        <slot></slot>
    </button>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
button {
    display: flex;
    align-items: center;
    height: 3.2rem;
    padding: 0 1.6rem;
}
</style>
