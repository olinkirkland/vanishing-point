import Project from '@/project';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useProjectsStore = defineStore('projects', () => {
    const projects = ref<Project[]>([]);

    // Watch for changes and save to localStorage
    watch(
        projects,
        (newProjects) => {
            localStorage.setItem('projects', JSON.stringify(newProjects));
        },
        { deep: true }
    );

    // Load projects from localStorage
    function loadProjectsFromLocalStorage(): void {
        const storedProjects = localStorage.getItem('projects');
        projects.value = storedProjects ? JSON.parse(storedProjects) : [];
    }

    // Get a project by ID
    function getProjectById(id: string): Project | undefined {
        return projects.value.find((project) => project.id === id);
    }

    // Add a new project
    function addProject(project: Project): void {
        projects.value.push(project);
    }

    // Remove a project by ID
    function removeProjectById(id: string): void {
        projects.value = projects.value.filter((project) => project.id !== id);
    }

    return {
        projects,
        loadProjectsFromLocalStorage,
        getProjectById,
        addProject,
        removeProjectById
    };
});
