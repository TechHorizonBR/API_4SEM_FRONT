<template>
    <div class="map-wrap">
      <div class="map" ref="mapContainer"></div>
     </div>

     <button @click="mudarDark">Dark</button>
     <button @click="mudarClaro">Claro</button>
     <button @click="adicionarGeoJson">Add rota</button>
    
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
    map.value = markRaw(new Map({
      container: mapContainer.value,
      style: MapStyle.OPENSTREETMAP,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    }));

    map.onMounted( 'click',)
  })

  function mudarClaro (mapa){
    
    config.apiKey = 'tF1lf7jSig6Ou8IuaLtw';
  
    const initialState = { lng: -45.79513, lat: -23.162272, zoom: 15 };
    map.value = markRaw(new Map({
      container: mapContainer.value,
      style: MapStyle.OPENSTREETMAP,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    }));
  }

  function mudarDark (){

    config.apiKey = 'tF1lf7jSig6Ou8IuaLtw';

    const initialState = { lng: -45.79513, lat: -23.162272, zoom: 15 };
    map.value = markRaw(new Map({
      container: mapContainer.value,
      style: "basic-v2-dark",
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    }));
  }

  function adicionarGeoJson(){

    config.apiKey = 'tF1lf7jSig6Ou8IuaLtw';
      const map = new Map({
        container: mapContainer.value, // container's id or the HTML element to render the map
        style:"basic-v2-dark",
        center: [-45.79513,  -23.162272], // starting position [lng, lat]
        zoom: 15, // starting zoom
      });
      map.on('load', async function() {
        const geojson = await data.get('https://api.maptiler.com/data/4dff6bfe-3e00-4393-9d52-036da416144f/features.json?key=tF1lf7jSig6Ou8IuaLtw');
        map.addSource('gps_tracks', {
          'type': 'geojson',
          'data': geojson
        });
        
        map.addLayer({
          'id': 'grand_teton',
          'type': 'line',
          'source': 'gps_tracks',
          'layout': {},
          'paint': {
            'line-color': '#e11',
            'line-width': 4
          }
        });
      });
  }
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