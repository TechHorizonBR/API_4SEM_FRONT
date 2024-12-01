<template>
  <div class="map-wrap">
    <div class="map" ref="mapContainer"></div>
  </div>
</template>

<script setup>
import { Map, MapStyle, Marker, config } from "@maptiler/sdk";
import { shallowRef, onMounted, onUnmounted, markRaw } from "vue";
import "@maptiler/sdk/dist/maptiler-sdk.css";

const mapContainer = shallowRef(null);
const map = shallowRef(null);

onMounted(() => {
  config.apiKey = "tF1lf7jSig6Ou8IuaLtw";

  const initialState = { lng: -20, lat: 0, zoom: 2 };

  map.value = markRaw(
    new Map({
      container: mapContainer.value,
      style: MapStyle.SATELLITE,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
      navigationControl: false,
      geolocateControl: false,
      logoPosition: "top-right",
      interactive: false,
    }),
  );

  map.value.removeControl();
}),
  onUnmounted(() => {
    map.value?.remove();
  });
</script>

<style scoped>
.map-wrap {
  position: relative;
  width: 100%;
  height: 100vh;
}

.map {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
