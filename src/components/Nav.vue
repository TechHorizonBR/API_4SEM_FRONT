<template>
  <nav class="navbar"
    :style="{backgroundColor: isDark ? '#0a0012e3' : '#f7f7f7'}">
    <ul class="navbar-list">
      <li class="navbar-item">
        <button @click="toggleFilter"
          :style="{color: isDark ? '#fff' : '#4b0076'}">
          <font-awesome-icon :icon="['fas', 'filter']" />
          Filter
        </button>
      </li>
      <li class="navbar-item">
        <button @click="goToMapMarker"
        :style="{color: isDark ? '#fff' : '#4b0076'}">
          <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
          Map Marker
        </button>
      </li>
      <li class="navbar-item">
        <button @click="triggerAlert"
        :style="{color: isDark ? '#fff' : '#4b0076'}">
          <font-awesome-icon :icon="['fas', 'bell']"/>
          Alerts
        </button>
      </li>
      <li class="navbar-item">
        <button @click="addUser"
        :style="{color: isDark ? '#fff' : '#4b0076'}">
          <font-awesome-icon :icon="['fas', 'user-plus']" />
          Add User
        </button>
      </li>
      <li class="navbar-item">
        <button @click="signInOut"
        :style="{color: isDark ? '#fff' : '#4b0076'}">
          <font-awesome-icon :icon="['fas', 'sign-in-alt']" />
          Sign in/out
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBell, faMapMarkerAlt, faFilter, faUserPlus, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

// Define props
const props = defineProps<{
  isDark: boolean;
}>();

// Define emits
const emit = defineEmits<{
  (e: 'toggleFilter'): void;
}>();

// Methods
const toggleFilter = () => {
  emit('toggleFilter');
};

const triggerAlert = () => {
  console.log('Alerts clicked');
};

const goToMapMarker = () => {
  console.log('Map Marker clicked');
};

const addUser = () => {
  console.log('Add User clicked');
};

const signInOut = () => {
  console.log('Sign In/Out clicked');
};
</script>

<style scoped>
.ico-logo{
  width: 15%;

}
.navbar {
  position: fixed;
  margin-bottom: 20px;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  background-color: #f7f7f7;
  padding: 15px 120px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
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
.navbar-item-img{
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  justify-content: center;
  margin-right: -25em;
}

.navbar-item button {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: #4b0076;
  font-size: 17px;
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
