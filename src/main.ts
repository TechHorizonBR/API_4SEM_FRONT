import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser, faBell, faMapMarkerAlt, faFilter, faUserPlus, faSignInAlt, faMapPin, faMapLocationDot, faClock, faMobile, faCalendar, faTrash, faMap, faEye } from '@fortawesome/free-solid-svg-icons';

import "./styles.css";

// Adiciona os ícones à biblioteca do FontAwesome, incluindo o ícone de filtro (faFilter)
library.add(faUser, faBell, faMapMarkerAlt, faUserPlus, faSignInAlt, faFilter, faMapPin, faMapLocationDot, faClock, faMobile, faCalendar, faTrash, faMap, faEye);

// Cria a aplicação
const app = createApp(App);

// Registra o FontAwesome globalmente
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(createPinia());
app.use(router);
app.mount("#app");
