<template>
    <div class="modal__header">
        <slot></slot>
        <Button icon class="close" v-if="closeButton" @click="onClickClose">
            <i class="fas fa-times"></i>
        </Button>
    </div>
</template>

<script setup lang="ts">
import ModalController from '@/controllers/modal-controller';

const props = defineProps({
    closeButton: Boolean,
    closeButtonAction: Function
});

function onClickClose() {
    props.closeButtonAction
        ? props.closeButtonAction()
        : ModalController.close();
}
</script>

<style lang="scss" scoped>
.modal__header {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 4.8rem;
    padding: 2rem;
    gap: 1.6rem;
    background-color: var(--color-surface-lighter);

    .close {
        position: absolute;
        top: 1rem;
        right: 1rem;
    }
}
</style>
