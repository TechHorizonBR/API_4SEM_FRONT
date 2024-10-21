<template>
    <div v-if="show" class="alert">
      <p>{{ message }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{ message: string, show: boolean }>();
  </script>  

    <style scoped>

    .alert-popup {
        position: fixed;
        bottom: 20px;
        left: 35px;
        background-color: #35005d;
        color: white;
        padding: 12px;
        border-radius: 15px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: fadeInOut 3s ease-in-out; /* Animação de aparecer/desaparecer */
    }

    @keyframes fadeInOut {
        0% {
        opacity: 0;
        transform: translateY(10px);
        }
        10% {
        opacity: 1;
        transform: translateY(0); 
        }
        90% {
        opacity: 1;
        transform: translateY(0); 
        }
        100% {
        opacity: 0;
        transform: translateY(10px); 
        }
    }
    </style>