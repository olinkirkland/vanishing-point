import Dialogue, { DialogueOption } from '@/dialogue';
import Project from '@/project';
import Scene from '@/scene';
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
    function getProject(id: string): Project | undefined {
        return projects.value.find((project) => project.id === id);
    }

    // Add a new project
    function addProject(project: Project): void {
        projects.value.push(project);
    }

    // Remove a project by ID
    function removeProject(id: string): void {
        projects.value = projects.value.filter((project) => project.id !== id);
    }

    // Add a scene to a project
    function addScene(projectId: string, scene: Scene): void {
        const project = getProject(projectId);
        if (!project) return; // Project not found
        project.scenes.push(scene);
    }

    // Remove a scene from a project
    function removeScene(projectId: string, sceneId: string): void {
        const project = getProject(projectId);
        if (!project) return; // Project not found
        project.scenes = project.scenes.filter((scene) => scene.id !== sceneId);
    }

    // Add a dialogue to a scene
    function addDialogue(
        projectId: string,
        sceneId: string,
        dialogue: Dialogue
    ): void {
        const project = getProject(projectId);
        if (!project) return; // Project not found
        const scene = project.scenes.find((s) => s.id === sceneId);
        if (!scene) return; // Scene not found
        scene.dialogues.push(dialogue);
    }

    // Remove a dialogue from a scene
    function removeDialogue(
        projectId: string,
        sceneId: string,
        dialogueId: string
    ): void {
        const project = getProject(projectId);
        if (!project) return; // Project not found
        const scene = project.scenes.find((s) => s.id === sceneId);
        if (!scene) return; // Scene not found
        const dialogueIndex = scene.dialogues.findIndex(
            (dialogue) => dialogue.id === dialogueId
        );
        if (dialogueIndex === -1) return; // Dialogue not found
        scene.dialogues = scene.dialogues.filter(
            (dialogue) => dialogue.id !== dialogueId
        );
    }

    // Add an option to a dialogue
    function addOption(
        projectId: string,
        sceneId: string,
        dialogueId: string,
        option: DialogueOption
    ): void {
        const project = getProject(projectId);
        if (!project) return; // Project not found
        const scene = project.scenes.find((s) => s.id === sceneId);
        if (!scene) return; // Scene not found
        const dialogue = scene.dialogues.find((d) => d.id === dialogueId);
        if (!dialogue) return; // Dialogue not found
        dialogue.data.options.push(option);
    }

    // Remove an option from a dialogue
    function removeOption(
        projectId: string,
        sceneId: string,
        dialogueId: string,
        optionId: string
    ): void {
        const project = getProject(projectId);
        if (!project) return; // Project not found
        const scene = project.scenes.find((s) => s.id === sceneId);
        if (!scene) return; // Scene not found
        const dialogue = scene.dialogues.find((d) => d.id === dialogueId);
        if (!dialogue) return; // Dialogue not found
        const optionIndex = dialogue.data.options.findIndex(
            (option) => option.id === optionId
        );
        if (optionIndex === -1) return; // Option not found
        dialogue.data.options = dialogue.data.options.filter(
            (option) => option.id !== optionId
        );
    }

    return {
        projects,
        loadProjectsFromLocalStorage,
        getProject,
        addProject,
        removeProject,
        addScene,
        removeScene,
        addDialogue,
        removeDialogue,
        addOption,
        removeOption
    };
});
