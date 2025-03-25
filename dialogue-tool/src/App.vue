<template>
    <div class="app-layout">
        <router-view name="page"></router-view>
        <the-modal-container />
    </div>
</template>

<script setup lang="ts">
import TheModalContainer from '@/components/modals/TheModalContainer.vue';
</script>

<style lang="scss" scoped></style>
