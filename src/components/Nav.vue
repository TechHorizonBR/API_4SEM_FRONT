<template>
  <nav class="navbar" :style="{ backgroundColor: isDark ? '#0a0012e3' : '#f7f7f7cd' }">
    <ul class="navbar-list">
      <li class="navbar-item">
        <button
          @click="toggleFilter"
          :class="{ 'dark-button': isDark, 'light-button': !isDark }"
        >
          <font-awesome-icon :icon="['fas', 'filter']" />
          Filter
        </button>
      </li>
      <li class="navbar-item">
        <button
          @click="goToMapMarker"
          :class="{ 'dark-button': isDark, 'light-button': !isDark }"
        >
          <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
          Map Marker
        </button>
      </li>
      <li class="navbar-item logo">
        <img 
          src="../assets/localTracker.ico" 
          alt="Logo" 
          class="logo-image" 
          @click="resetMap" 
          style="cursor: pointer;" 
        />
      </li>
      <li class="navbar-item">
        <button
          @click="addUser"
          :class="{ 'dark-button': isDark, 'light-button': !isDark }"
        >
          <font-awesome-icon :icon="['fas', 'user-plus']" />
          Add User
        </button>
      </li>
      <li class="navbar-item">
        <button
          @click="signInOut"
          :class="{ 'dark-button': isDark, 'light-button': !isDark }"
        >
          <font-awesome-icon :icon="['fas', 'sign-in-alt']" />
          Sign in/out
        </button> 
      </li>
    </ul>
  </nav>

  <div class="username-container">
    <div class="user-icon" :class="{'username-label-container-dark': isDark, 'username-label-container-light': !isDark}">
      <font-awesome-icon :icon="['fas', 'user']" />
    </div>
    <div class="username-label-container" :class="{'username-label-container-dark': isDark, 'username-label-container-light': !isDark}">
      <div class="username-label">Username</div>
    </div>
  </div>
  <transition
  name="fade">
  <MapMarker @mapEmit="sendPolygon" @deleteEmit="deletePolygon" v-if="showComponentsMode.mapMarker" :isDark="isDark" :map="$props.map" />
  </transition>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import MapMarker from './MapMarker.vue';
import { showComponents } from '@/stores/showComponents';


export default {
  name: "Navbar",
  props: {
    isDark: {
      type: Boolean,
      required: true,
    },
    map: {
      type: Object,
      required: true
    }
  },
  components: {
    FontAwesomeIcon,
    MapMarker,
  },
  emits: [
    'toggleFilter',
    'resetMap',
    'setPolygon',
    'deleteArea'
    // Evento para resetar o mapa
  ],
  methods: {
    toggleFilter() {
      this.$emit("toggleFilter");
    },
    resetMap() {
      this.$emit("resetMap"); // Emitir evento resetMap
    },
    sendPolygon(coordinates: [], user_id:number){
      this.$emit("setPolygon", coordinates, user_id);
    },
    deletePolygon(user_id: number){
      this.$emit("deleteArea", user_id)
    },
    goToMapMarker() {
      if(this.showComponentsMode.mapMarker){
        this.showComponentsMode.esconderComponents();
      }else{
        this.showComponentsMode.showMapMaker();
      }
    },
    addUser() {
      // Lógica para adicionar um usuário
    },
    signInOut() {
      // Lógica para sign in/out
    },
  },
  data() {
  return {
    showMapMarker: false,
    showComponentsMode: showComponents()
    };
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
.username-label-container-dark {
  background: #0a0012e3;
  color: white;
}
.username-label-container-light {
  background: white;
  color: #4b0076;
}
.username-label-container {
  width: 120px;
  height: 30px;
  display: inline-flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  border-radius: 25px;
  margin-top: -15px;
}
.user-icon {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 28px;
}

.navbar-item.logo {
  display: flex;
  align-items: center;
}

.logo-image {
  height: 40px;
}

.username-label {
  font-size: 14px;
  font-weight: bold;
}
.dark-button {
  color: #fff;
}
.light-button {
  color: #4b0076;
}
</style>
