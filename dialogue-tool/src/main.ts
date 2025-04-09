import Button from '@/components/ui/Button.vue';
import { router } from '@/router';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import i18n from './i18n/locale';
import { useProjectsStore } from './store/projects-store';
import Panel from './components/ui/Panel.vue';
import Card from './components/ui/Card.vue';
import List from './components/ui/List.vue';

// Create the app
const app = createApp(App);
const pinia = createPinia();

// Plugins
app.use(router);
app.use(i18n);
app.use(pinia);

// Components
app.component('Button', Button);
app.component('Panel', Panel);
app.component('Card', Card);
app.component('List', List);

// Load projects from localStorage
const projectsStore = useProjectsStore();
projectsStore.loadProjectsFromLocalStorage();

// Mount the app
app.mount('#app');
