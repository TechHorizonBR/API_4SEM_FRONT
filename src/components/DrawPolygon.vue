<template></template>

<script lang="ts" setup>
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps<{
  map: MapboxDraw;
}>();

const draw = ref<MapboxDraw | null>(null);
const coordenadas = ref<any[]>([]);
const emit = defineEmits(["enviarCoordenadas"]);

function enviarCoordenadas() {
  emit("enviarCoordenadas", listCoordinates.value, draw.value);
}

function addCoordenadas(coord: any) {
  coordenadas.value = coord;
}

const listCoordinates = ref<[]>([]);

function parseCoordinates(coordinates: any) {
  listCoordinates.value = [];
  for (let i = 0; i < coordinates.length; i++) {
    listCoordinates.value.push(coordinates[i].geometry.coordinates[0]);
  }
}

function drawInit() {
  draw.value = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      polygon: true,
      trash: true,
    },
  });

  function updateArea(event: any) {
    const data = draw.value?.getAll();

    if (data && data.features.length > 0) {
      addCoordenadas(data.features);
      parseCoordinates(coordenadas.value);
      enviarCoordenadas();
    }
  }

  props.map.on("draw.create", updateArea);
  props.map.on("draw.delete", updateArea);
  props.map.on("draw.update", updateArea);

  props.map.addControl(draw.value);

  const drawControls = document.querySelectorAll(
    ".mapboxgl-ctrl-group.mapboxgl-ctrl",
  );

  drawControls.forEach((elem) => {
    elem.classList.add("maplibregl-ctrl", "maplibregl-ctrl-group");
  });
}

function drawEnd() {
  if (props.map.hasControl(draw.value)) {
    props.map.removeControl(draw.value);
    draw.value = null;
  }
}

onMounted(() => drawInit());
onBeforeUnmount(() => drawEnd());
</script>

<style scoped>

.mapboxgl-ctrl-group {
  background-color: #f0f0f0 !important; 
  border-radius: 5px; 
  padding: 10px; 
}


.mapboxgl-ctrl-polygon {
  background-color: #ff5733 !important; 
  color: white; 
}


.mapboxgl-ctrl-trash {
  background-color: #d9534f !important; 
  color: white; 
}
</style>
