<template>
  <nav class="navbar"
    :style="{backgroundColor: isDark ? '#0a0012e3' : '#f7f7f7'}">
    <ul class="navbar-list">
      <li class="navbar-item">
        <button @click="toggleFilter"
          :class="{ 'dark-button': isDark, 'light-button': !isDark }">
          <font-awesome-icon :icon="['fas', 'filter']" />
          Filter
        </button>
      </li>
      <li class="navbar-item">
        <button @click="goToMapMarker"
        :class="{ 'dark-button' : isDark, 'light-button': !isDark}">
          <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
          Map Marker
        </button>
      </li>
      <li class="navbar-item">
        <button @click="triggerAlert"
        :class="{ 'dark-button' : isDark, 'light-button': !isDark}">
          <font-awesome-icon :icon="['fas', 'bell']"/>
          Alerts
        </button>
      </li>
      <li class="navbar-item">
        <button @click="addUser"
        :class="{ 'dark-button' : isDark, 'light-button': !isDark}">
          <font-awesome-icon :icon="['fas', 'user-plus']" />
          Add User
        </button>
      </li>
      <li class="navbar-item">
        <button @click="signInOut"
        :class="{ 'dark-button' : isDark, 'light-button': !isDark}">
          <font-awesome-icon :icon="['fas', 'sign-in-alt']" />
          Sign in/out
        </button>
      </li>
    </ul>
  </nav>

  <!-- Campo Username no topo da tela -->
  <div class="username-container">
    <div class="user-icon">
        <font-awesome-icon :icon="['fas', 'user']" />
      </div>
      <div class="username-label-container">
        <div class="username-label">Username</div>
      </div>
  </div>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  name: "Navbar",
  props: {
    isDark: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    FontAwesomeIcon,
  },
  methods: {
    toggleFilter() {
      this.$emit("toggleFilter");
    },
    triggerAlert() {
      console.log("Alerts clicked");
    },
    goToMapMarker() {
      console.log("Map Marker clicked");
    },
    addUser() {
      console.log("Add User clicked");
    },
    signInOut() {
      console.log("Sign In/Out clicked");
    },
  },
};
</script>

<style scoped>
/* Navbar na parte inferior */
.navbar {
  position: fixed;
  margin-bottom: 20px;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  background-color: #f5f5f5e4;
  padding: 10px 30px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 1000;
}

.navbar-list {
  list-style: none;
  display: flex;
  gap: 20px; /* Espaçamento entre os itens */
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
  font-size: 13px;
  font-weight: bold;
}

.navbar-item button:hover {
  color: #7d009b;
}

/* Container do botão de Username no topo */
.username-container {
  position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.username-label-container {
  background: #4b0076;
    width: 120px;
    height: 30px;
    display: inline-flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    border-radius: 25px;
    margin-top: -15px;
}
.icon-alert, .icon-map-marker, .icon-filter, .icon-add-user, .icon-sign-in-out {
  font-size: 18px;
  margin-bottom: 5px;
}

.user-icon-container {
  display: flex;
  align-items: center;
  background-color: #4b0076;
  color: white;
  border-radius: 25px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  justify-content: center;
}

.user-icon {
  background-color: #4b0076;
    color: white;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-size: 28px;
}

.username-label {
  color: white;
  font-size: 14px;
  font-weight: bold;
}
.dark-button{
  color: #fff
}
.light-button{
  color: #4b0076
}
</style>
