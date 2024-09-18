<script setup lang="ts">
import { useMapModeStore } from '@/stores/useMapMode';
import { watch } from 'vue';

const mapModeStore = useMapModeStore();

// Assista as mudanças no estado do tema para executar a função de mudança de tema
watch(
  () => mapModeStore.isDarkMode,
  (newValue) => {
    mudarTemaMapa(newValue);
  }
);

// Função que muda o estilo do mapa (será substituída pela lógica real)
function mudarTemaMapa(isDark: boolean) {
  if (isDark) {
    // Aplique o estilo dark no mapa
    console.log('Mudando para modo escuro');
  } else {
    // Aplique o estilo light no mapa
    console.log('Mudando para modo claro');
  }
}

// Função para alternar o tema ao clicar no toggle
function toggleTheme() {
  mapModeStore.toggleMode();
}
</script>

<template>
  <!-- Rounded switch -->
  <label class="switch">
    <!-- v-model ligará diretamente ao estado da store -->
    <input type="checkbox" v-model="mapModeStore.isDarkMode">
    <span class="slider round"></span>
  </label>
</template>

<style>
/* Estilos para o switch */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #35005D;
}

input:focus + .slider {
  box-shadow: 0 0 1px #35005D;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Sliders arredondados */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
