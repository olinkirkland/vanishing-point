<template>
    <div class="page page--home">
        <Panel>
            <!-- <h1 class="logo">Storytree</h1>
            <p>A node-based dialogue tool.</p> -->

            <div class="flex">
                <Button primary @click="onClickNewProject">
                    <i class="fas fa-plus-circle"></i>
                    <span>New Project</span>
                </Button>
                <Button @click="onClickLoadProject">
                    <i class="fas fa-folder-open"></i>
                    <span>Load Project</span>
                </Button>
            </div>
        </Panel>
        <Panel v-if="projects.length > 0">
            <h2>Projects</h2>
            <ul class="projects-list">
                <li
                    class="project-item"
                    v-for="project in projects"
                    :key="project.id"
                >
                    <pre>{{ project }}</pre>
                </li>
            </ul>
        </Panel>
        <footer></footer>
    </div>
</template>

<script setup lang="ts">
import Panel from '@/components/Panel.vue';
import Button from '@/components/ui/Button.vue';
import Project from '@/project';
import { v4 as uuid } from 'uuid';
import { onMounted, ref, watch } from 'vue';

const projects = ref<Project[]>([]);
onMounted(() => {
    loadProjectsFromLocalStorage();
});

watch(
    projects,
    (newProjects) => {
        localStorage.setItem('projects', JSON.stringify(newProjects));
    },
    { deep: true }
);

async function loadProjectsFromLocalStorage(): Promise<void> {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
        projects.value = JSON.parse(storedProjects);
    } else {
        projects.value = [];
    }
}

function onClickNewProject() {
    const newProject = new Project(
        uuid(),
        'New Project',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    );

    projects.value.push(newProject);
}

function onClickLoadProject(): void {
    // TODO
}
</script>

<style lang="scss" scoped>
.page {
    height: 100vh;
    padding: 2rem;
    gap: 0.8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .panel {
        width: 100%;
        max-width: 64rem;
    }

    h1.logo {
        font-size: 4rem;
    }
}
</style>
