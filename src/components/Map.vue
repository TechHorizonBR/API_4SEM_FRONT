<template>
    <div class="map-wrap">
      <div class="map" ref="mapContainer"></div>
    </div>
  </template>
  
  <script setup>
  import { Map, MapStyle, Marker, config } from '@maptiler/sdk';
  import { shallowRef, onMounted, onUnmounted, markRaw } from 'vue';
  import '@maptiler/sdk/dist/maptiler-sdk.css';
  
  const mapContainer = shallowRef(null);
  const map = shallowRef(null); 
  
  onMounted(() => {
    config.apiKey = 'tF1lf7jSig6Ou8IuaLtw';
  
    const initialState = { lng: -45.79513, lat: -23.162272, zoom: 15 };
  // -23.162272401176676, -45.79513088266788
    map.value = markRaw(new Map({
      container: mapContainer.value,
      style: MapStyle.OPENSTREETMAP,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    }));

    map.on('load', async function() {
    const geojson = await maptilersdk.data.get('https://api.maptiler.com/data/4dff6bfe-3e00-4393-9d52-036da416144f/features.json?key=tF1lf7jSig6Ou8IuaLtw');
    map.addSource('gps_tracks', {
        'type': 'geojson',
        'data': geojson
    });
}); 
    new Marker({color: "#00FF00", })
    .setLngLat([-45.79513,-23.162272])
    .addTo(map.value);

    
    //marker.togglePopup(); // toggle popup open or closed
  }),
  onUnmounted(() => {
    map.value?.remove();
  })
  </script>
  
  <style scoped>
  .map-wrap {
    position: relative;
    width: 100%;
    height: calc(100vh - 77px); /* calculate height of the screen minus the heading */
  }
  
  .map {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  </style>