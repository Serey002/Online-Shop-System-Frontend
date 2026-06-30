import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/style/main.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';

import { useAuthStore } from './stores/auth';

library.add(fasHeart, farHeart);

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);

// Mount the app immediately - don't wait for user fetch
app.mount('#app');

// Hydrate authenticated user in the background (non-blocking)
const authStore = useAuthStore();
if (localStorage.getItem('auth_token')) {
  authStore.fetchUser().catch((error) => {
    console.error('Failed to fetch user on app load:', error);
  });
}
