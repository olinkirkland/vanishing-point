import Button from '@/components/ui/Button.vue';
import { router } from '@/router';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import i18n from './i18n/locale';
import { useProjectsStore } from './store/projects-store';

// Create the app
const app = createApp(App);
const pinia = createPinia();

// Plugins
app.use(router);
app.use(i18n);
app.use(pinia);

// Components
app.component('Button', Button);

// Load projects from localStorage
const projectsStore = useProjectsStore();
projectsStore.loadProjectsFromLocalStorage();

// Mount the app
app.mount('#app');
