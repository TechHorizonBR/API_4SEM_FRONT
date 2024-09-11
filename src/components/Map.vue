<template>
  <div class="map-wrap">
    <div class="map" ref="mapContainer" style="width: 100%; height: 500px"></div>
  </div>

  <button @click="mudarDark">Dark</button>
  <button @click="mudarClaro">Claro</button>
  <button @click="adicionarGeoJson">Add rota</button>
</template>

<script setup>
import { Map, MapStyle, config } from '@maptiler/sdk';
import { shallowRef, onMounted, onUnmounted, markRaw } from 'vue';
import '@maptiler/sdk/dist/maptiler-sdk.css';

const mapContainer = shallowRef(null);
const map = shallowRef(null); // Referência ao mapa

// Configura a chave de API ao montar o componente
onMounted(() => {
  config.apiKey = 'tF1lf7jSig6Ou8IuaLtw';
  // Inicializa o mapa ao montar o componente
  inicializarMapa();
});

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
  }
});

// Função para inicializar o mapa
function inicializarMapa() {
  const initialState = { lng: -45.79513, lat: -23.162272, zoom: 15 };

  map.value = markRaw(new Map({
    container: mapContainer.value,
    style: MapStyle.OPENSTREETMAP, // Estilo inicial do mapa
    center: [initialState.lng, initialState.lat],
    zoom: initialState.zoom,
  }));
}

// Função para mudar para o tema escuro
function mudarDark() {
  if (map.value) {
    map.value.setStyle('https://api.maptiler.com/maps/basic-v2-dark/style.json?key=tF1lf7jSig6Ou8IuaLtw');
  }
}

// Função para mudar para o tema claro
function mudarClaro() {
  if (map.value) {
    map.value.setStyle('https://api.maptiler.com/maps/openstreetmap/style.json?key=tF1lf7jSig6Ou8IuaLtw');
  }
}

// Função para adicionar o GeoJSON ao mapa
async function adicionarGeoJson() {
  if (map.value) {
    try {
      const response = await fetch(
        'https://api.maptiler.com/data/4dff6bfe-3e00-4393-9d52-036da416144f/features.json?key=tF1lf7jSig6Ou8IuaLtw'
      );
      const geojson = await response.json();

      map.value.addSource('gps_tracks', {
        'type': 'geojson',
        'data': geojson,
      });

      map.value.addLayer({
        'id': 'grand_teton',
        'type': 'line',
        'source': 'gps_tracks',
        'layout': {},
        'paint': {
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
  height: 500px;
}
</style>
