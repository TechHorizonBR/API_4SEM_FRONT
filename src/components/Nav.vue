<template>
    <nav class="navbar">
      <ul class="navbar-list">
        <li class="navbar-item">
          <button @click="triggerAlert"> 
            <i class="icon-alert"></i> Alerts
          </button>
        </li>
        <li class="navbar-item">
          <button @click="goToMapMarker">
            <i class="icon-map-marker"></i> Map Marker
          </button>
        </li>
        <li class="navbar-item">
          <button @click="showMap">
            <i class="icon-map"></i> Map
          </button>
        </li>
        <li class="navbar-item">
          <button @click="addUser">
            <i class="icon-add-user"></i> Add User
          </button>
        </li>
        <li class="navbar-item">
          <button @click="signInOut">
            <i class="icon-sign-in-out"></i> Sign in/out
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
  