<template>
  <div class="map-wrap">
    <div class="map" ref="mapContainer">
      <div id="buttonConfig">
        <LightDarkToggle />
        <button @click="adicionarGeoJson" class="buttonConfig">Add rota</button>
      </div>
    </div>
  </div>
</template>

<script setup   >
import { Map, config } from '@maptiler/sdk';
import { shallowRef, onMounted, onUnmounted, markRaw, watch } from 'vue';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import LightDarkToggle from './LightDarkToggle.vue';
import axios from 'axios';
import { useMapModeStore } from '@/stores/useMapMode';

const mapContainer = shallowRef(null);
const map = shallowRef(null);
const mapModeStore = useMapModeStore();

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
        ? 'https://api.maptiler.com/maps/basic-v2-dark/style.json?key=tF1lf7jSig6Ou8IuaLtw'
        : 'https://api.maptiler.com/maps/openstreetmap/style.json?key=tF1lf7jSig6Ou8IuaLtw',
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
          ? 'https://api.maptiler.com/maps/basic-v2-dark/style.json?key=tF1lf7jSig6Ou8IuaLtw'
          : 'https://api.maptiler.com/maps/openstreetmap/style.json?key=tF1lf7jSig6Ou8IuaLtw'
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

<style>
.map-wrap {
  position: relative;
}

.map {
  width: 100%;
  height: 100vh
}

#buttonConfig{
  position: absolute;
  z-index: 10;
  bottom: 60px;
  right: 0;
}
</style>