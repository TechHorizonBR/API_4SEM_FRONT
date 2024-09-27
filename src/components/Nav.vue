<template>
  <nav class="navbar">
    <ul class="navbar-list">
      <li class="navbar-item">
        <button @click="toggleFilter">
          <font-awesome-icon :icon="['fas', 'filter']" />
          Filter
        </button>
      </li>
      <li class="navbar-item">
        <button @click="goToMapMarker">
          <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
          Map Marker
        </button>
      </li>
      <li class="navbar-item">
        <button @click="triggerAlert">
          <font-awesome-icon :icon="['fas', 'bell']" />
          Alerts
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
import { faBell, faMapMarkerAlt, faFilter, faUserPlus, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default defineComponent({
  name: 'Navbar',
  components: {
    FontAwesomeIcon
  },
  methods: {
    toggleFilter() {
      // Emite um evento para o componente pai alternar a visibilidade do filtro
      this.$emit('toggleFilter');
    },
    triggerAlert() {
      console.log('Alerts clicked');
    },
    goToMapMarker() {
      console.log('Map Marker clicked');
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
  margin-bottom: 20px;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  background-color: #f7f7f7;
  padding: 10px 30px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px 8px 8px 8px;
  z-index: 1000;
}

.navbar-list {
  list-style: none;
  display: flex;
  gap: 20px; /* Aumenta o espaçamento entre os itens */
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
  font-size: 12px;
  font-weight: bold;
}

.navbar-item button:hover {
  color: #7d009b;
}

.icon-alert, .icon-map-marker, .icon-filter, .icon-add-user, .icon-sign-in-out {
  font-size: 18px;
  margin-bottom: 5px;
}

@media (max-width: 600px) {
  .navbar-list {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
