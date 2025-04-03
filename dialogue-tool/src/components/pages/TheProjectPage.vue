<script setup lang="ts">
import Panel from '@/components/Panel.vue';
import Button from '@/components/ui/Button.vue';
import ModalController from '@/controllers/modal-controller';
import { t } from '@/i18n/locale';
import Project from '@/project';
import { PageName, router } from '@/router';
import { useProjectsStore } from '@/store/projects-store';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import ConfirmModal from '../modals/templates/ConfirmModal.vue';

const route = useRoute();
const projectsStore = useProjectsStore();
const projectId = ref<string | null>((route.params.id as string) || null);
const project = ref<Project | null>(
    projectsStore.getProjectById(projectId.value as string) || null
);

function onClickHome() {
    // Redirect to the home page
    router.push({ name: PageName.HOME });
}

function onClickRemove() {
    ModalController.open(ConfirmModal, {
        title: t('UI.Modals.Delete-project.title'),
        message: t('UI.Modals.Delete-project.message'),
        confirmText: t('UI.Modals.Delete-project.Controls.confirm'),
        cancelText: t('UI.Modals.Delete-project.Controls.cancel'),
        isConfirmButtonCta: true,
        onConfirm: () => {
            projectsStore.removeProjectById(projectId.value as string);
            router.push({ name: PageName.HOME });
            ModalController.close();
        },
        onCancel: () => {
            ModalController.close();
        }
    });
}
</script>

<template>
    <div class="page page--project">
        <Panel>
            <h2>Project</h2>
            <pre>{{ projectId }}</pre>
            <div class="flex">
                <Button @click="onClickHome">
                    <i class="fas fa-home"></i>
                    <span>Home</span>
                </Button>
                <Button @click="onClickRemove">
                    <i class="fas fa-trash"></i>
                    <span>Delete</span>
                </Button>
            </div>
        </Panel>
    </div>
</template>
