<script setup>
import { ref } from 'vue';
import Map from './components/Map.vue';
import Navbar from './components/Nav.vue';
import Filter from './components/Filter.vue';

// Controla a visibilidade do filtro
const showFilter = ref(false);

// Função para alternar a visibilidade do filtro
const toggleFilterVisibility = () => {
  showFilter.value = !showFilter.value;
};
</script>

<template>
  <Navbar @toggleFilter="toggleFilterVisibility" />
  <Map />
  <Filter :showFilter="showFilter" />
</template>

<style scoped>
/* Estilos podem ser adicionados aqui se necessário */
</style>
