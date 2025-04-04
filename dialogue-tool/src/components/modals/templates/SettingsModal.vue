<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader closeButton>
                <h2>Project Settings</h2>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="settings">
                <ul class="list-description">
                    <li><strong>Project ID:</strong> {{ project.id }}</li>
                    <li><strong>Project Name:</strong> {{ project.name }}</li>
                    <li>
                        <strong>Project Description:</strong> Lorem ipsum dolor
                        sit amet, consectetur adipiscing elit.
                    </li>
                </ul>

                <Button @click="onClickDeleteProject">
                    <i class="fas fa-exclamation-triangle"></i>
                    Delete Project
                </Button>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/ModalFrame.vue';
import ModalHeader from '@/components/modals/ModalHeader.vue';
import ModalController from '@/controllers/modal-controller';
import { t } from '@/i18n/locale';
import Project from '@/project';
import { PageName, router } from '@/router';
import { useProjectsStore } from '@/store/projects-store';
import ConfirmModal from './ConfirmModal.vue';
import SettingsModal from './SettingsModal.vue';
import Button from '@/components/ui/Button.vue';

const props = defineProps<{
    project: Project;
}>();

function onClickDeleteProject() {
    ModalController.close();
    ModalController.open(ConfirmModal, {
        title: t('UI.Modals.Delete-project.title'),
        message: t('UI.Modals.Delete-project.message'),
        confirmText: t('UI.Modals.Delete-project.Controls.confirm'),
        cancelText: t('UI.Modals.Delete-project.Controls.cancel'),
        isConfirmButtonCta: true,
        onConfirm: () => {
            router.push({ name: PageName.HOME });
            useProjectsStore().removeProjectById(props.project.id);
            ModalController.close();
        },
        onCancel: () => {
            ModalController.close();
            ModalController.open(SettingsModal, {
                project: props.project
            });
        }
    });
}
</script>

<style scoped lang="scss">
.settings {
    display: flex;
    max-width: 64rem;
    flex-direction: column;
    gap: 1.6rem;
    justify-content: flex-start;
    align-items: flex-start;
    height: 100%;
}

ul.list-description {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

@media (max-width: 768px) {
}
</style>
