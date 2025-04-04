<template>
    <div class="page page--home">
        <Panel class="controls-panel">
            <!-- <h1 class="logo">Storytree</h1>
            <p>A node-based dialogue tool.</p> -->

            <div class="flex">
                <Button primary @click="onClickNewProject">
                    <i class="fas fa-plus-circle"></i>
                    <span>New Project</span>
                </Button>
                <Button @click="onClickLoadProject" disabled>
                    <i class="fas fa-folder-open"></i>
                    <span>Load Project</span>
                </Button>
            </div>
        </Panel>
        <Panel v-if="projects.length > 0" class="projects-panel">
            <h2>Projects</h2>
            <ul class="projects-list">
                <ProjectCard
                    v-for="project in projects"
                    :project="project"
                    :key="project.id"
                ></ProjectCard>
            </ul>
        </Panel>
        <footer></footer>
    </div>
</template>

<script setup lang="ts">
import Panel from '@/components/Panel.vue';
import Button from '@/components/ui/Button.vue';
import Project from '@/project';
import { useProjectsStore } from '@/store/projects-store';
import { v4 as uuid } from 'uuid';
import ProjectCard from '../ProjectCard.vue';
import { PageName, router } from '@/router';

const projectsStore = useProjectsStore();
const projects = projectsStore.projects;

function onClickNewProject() {
    const newProject = new Project(
        uuid(),
        'New Project',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    );

    projectsStore.addProject(newProject);
    // Open the new project in the editor
    router.push({
        name: PageName.PROJECT,
        params: { id: newProject.id }
    });
}

function onClickLoadProject() {
    // TODO: Load a project from the file system
}
</script>

<style lang="scss" scoped>
.panel {
    width: 100%;
    max-width: 64rem;

    &.controls-panel {
        flex: 0 0 auto;
    }
}

h1.logo {
    font-size: 4rem;
}

.projects-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.2rem;
}
</style>
