<template>
    <nav class="navbar">
      <ul class="navbar-list">
        <li class="navbar-item">
          <button @click="triggerAlert">
            <font-awesome-icon :icon="['fas', 'bell']" />
            Alerts
          </button>
        </li>
        <li class="navbar-item">
          <button @click="goToMapMarker">
            <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
            Map Marker
          </button>
        </li>
        <li class="navbar-item">
          <button @click="showMap">
            <font-awesome-icon :icon="['fas', 'map']" />
            Map
          </button>
        </li>
        <li class="navbar-item">
          <button @click="addUser">
            <font-awesome-icon :icon="['fas', 'user-plus']" />
            Add User
          </button>
        </li>
        <li class="navbar-item">
          <button @click="signInOut">
            <font-awesome-icon :icon="['fas', 'sign-in-alt']" />
            Sign in/out
          </button>
        </li>
      </ul>
    </nav>
  </template>  
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'Navbar',
    methods: {
      triggerAlert() {
        console.log('Alerts clicked');
      },
      goToMapMarker() {
        console.log('Map Marker clicked');
      },
      showMap() {
        console.log('Map clicked');
      },
      addUser() {
        console.log('Add User clicked');
      },
      signInOut() {
        console.log('Sign In/Out clicked');
      }
    }
  });
  </script>
<style scoped>
.navbar {
  position: fixed;
  margin-bottom: 20px; /* Ajuste o valor conforme a necessidade */
  bottom: 0; /* Posiciona a barra no final da página */
  left: 50%; /* Move o ponto de referência horizontalmente para o centro */
  transform: translateX(-50%); /* Centraliza a barra horizontalmente */
  display: flex;
  justify-content: center;
  background-color: #f7f7f7;
  padding: 10px 105px; /* Ajusta o padding para mais espaço nas laterais */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); /* Sombras suaves no topo da barra */
  border-radius: 8px 8px 0 0; /* Bordas arredondadas no topo */
  max-width: 95%; /* Limita a largura máxima da barra */
  z-index: 1000; /* Garante que a barra fique sempre acima dos outros elementos */
}

.navbar-list {
  list-style: none;
  display: flex;
  gap: 10px; /* Espaçamento entre os itens */
  padding: 0;
  margin: 0;
}

.navbar-item {
  display: flex;
  align-items: center;
}

.navbar-item button {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: #4b0076;
  font-size: 11px; /* Tamanho menor do texto */
  font-weight: bold;
}

.navbar-item button:hover {
  color: #7d009b;
}

.icon-alert, .icon-map-marker, .icon-map, .icon-add-user, .icon-sign-in-out {
  font-size: 14px; /* Tamanho menor dos ícones */
  margin-bottom: 1px; /* Aproxima o ícone do texto */
}

/* Responsividade para dispositivos móveis */
@media (max-width: 600px) {
  .navbar-list {
    flex-direction: column;
    gap: 8px;
  }
}
</style>

  