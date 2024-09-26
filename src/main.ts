import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBell, faMapMarkerAlt, faMap, faUserPlus, faSignInAlt, faFilter } from '@fortawesome/free-solid-svg-icons'; // Ícones que você vai usar

import './styles.css';

// Adiciona os ícones à biblioteca do FontAwesome, incluindo o ícone de filtro (faFilter)
library.add(faBell, faMapMarkerAlt, faMap, faUserPlus, faSignInAlt, faFilter);

// Cria a aplicação
const app = createApp(App);

// Registra o FontAwesome globalmente
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(createPinia());
app.use(router);

app.mount('#app');
