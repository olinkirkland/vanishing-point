import { router } from '@/router';
import { createApp } from 'vue';
import App from './App.vue';
import i18n from './i18n/locale';

// Create the app
const app = createApp(App);

// Plugins
app.use(router);
app.use(i18n);

// Mount the app
app.mount('#app');
