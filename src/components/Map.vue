<template>
  <div class="map-wrap">
    <div class="map" ref="mapContainer">
      <div id="buttonConfig">
        <LightDarkToggle />
        <button @click="adicionarGeoJson" class="buttonConfig">Add rota</button>
      </div>
      <div class="nav-container">
        <Nav @toggleFilter="showFilter = !showFilter" />
      </div>

      <div class="filter-container">
        <Filter v-if="showFilter" :isDarkMode="mapModeStore.isDarkMode" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Map, MapStyle, config } from '@maptiler/sdk';
import { shallowRef, onMounted, onUnmounted, markRaw, watch } from 'vue';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import LightDarkToggle from './LightDarkToggle.vue';
import Filter from './Filter.vue';
import Nav from './Nav.vue';
import axios from 'axios';
import { useMapModeStore } from '@/stores/useMapMode';

const mapContainer = shallowRef(null);
const map = shallowRef(null);
const mapModeStore = useMapModeStore();
const showFilter = shallowRef(false); // Inicialmente falso para não exibir o filtro

onMounted(() => {
  config.apiKey = 'tF1lf7jSig6Ou8IuaLtw';
  inicializarMapa();
});

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
  }
});

function inicializarMapa() {
  const initialState = { lng: -45.79513, lat: -23.162272, zoom: 15 };

  map.value = markRaw(
    new Map({
      container: mapContainer.value,
      style: mapModeStore.isDarkMode
        ? MapStyle.STREETS.DARK
        : MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    })
  );
}

watch(
  () => mapModeStore.isDarkMode,
  (isDarkMode) => {
    if (map.value) {
      map.value.setStyle(
        isDarkMode
          ? MapStyle.STREETS.DARK
          : MapStyle.STREETS
      );
    }
  }
);

async function adicionarGeoJson() {
  if (map.value) {
    try {
      const response = await axios.get(
        'https://api.maptiler.com/data/4dff6bfe-3e00-4393-9d52-036da416144f/features.json?key=tF1lf7jSig6Ou8IuaLtw'
      );
      const geojson = response.data;

      map.value.addSource('gps_tracks', {
        type: 'geojson',
        data: geojson,
      });

      map.value.addLayer({
        id: 'grand_teton',
        type: 'line',
        source: 'gps_tracks',
        layout: {},
        paint: {
          'line-color': '#e11',
          'line-width': 4,
        },
      });
    } catch (error) {
      console.error('Erro ao carregar o GeoJSON:', error);
    }
  }
}
</script>

<style scoped>
.map-wrap {
  position: relative;
}

.map {
  width: 100%;
  height: 100vh;
}

.filter-container {
  position: absolute;
  top: 10%; /* Ajustado para evitar sobreposição com a navbar */
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000; /* Maior que o z-index do mapa para garantir que o filtro esteja na frente */
  border-radius: 8px;
}

.nav-container {
  position: absolute;
  bottom: 2;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1500; /* Para garantir que a Nav fique acima do mapa */
}

.maplibregl-ctrl-top-right {
  right: 0;
  bottom: 6em !important;
  top: auto !important;
}

.maplibregl-ctrl button .maplibregl-ctrl-icon {
  background-color: #9e73bfd4;
  border-radius: 5px;
}

.maplibregl-ctrl-group {
  background: transparent !important;
}

#buttonConfig {
  position: absolute;
  z-index: 2;
  bottom: 20px;
  right: 10px;
  display: inline-flex;
  flex-direction: row-reverse;
  align-items: center;
}
</style>
