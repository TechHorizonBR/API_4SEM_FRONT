<template>
</template>

<script lang="ts" setup>
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useMapModeStore } from "@/stores/useMapMode";

const props = defineProps<{
  map: MapboxDraw
}>();

const mapModeStore = useMapModeStore();
const draw = ref<MapboxDraw | null>(null);
const coordenadas = ref<any[]>([]);
const listCoordinates = ref<any[]>([]); 
const emit = defineEmits<{
  (event: 'enviarCoordenadas', coords: any[], drawInstance: MapboxDraw | null): void;
}>();

function enviarCoordenadas() {
  emit('enviarCoordenadas', listCoordinates.value, draw.value);
}

function addCoordenadas(coord: any) {
  coordenadas.value = coord;
}

function parseCoordinates(coordinates: any) {
  listCoordinates.value = coordinates.map((item: any) => item.geometry.coordinates[0]);
}

const applyFilterToIcons = (className: string, isDarkMode: boolean) => {
  const elements = document.getElementsByClassName(className);
  Array.from(elements).forEach((icon) => {
    const iconElement = icon as HTMLElement;
    iconElement.style.filter = isDarkMode ? "invert(100%)" : "none";
  });
};

function drawInit() {
  draw.value = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      polygon: true,
      trash: true,
    },
  });

  applyFilterToIcons("mapbox-gl-draw_polygon", mapModeStore.isDarkMode);
  applyFilterToIcons("mapbox-gl-draw_trash", mapModeStore.isDarkMode);

  function updateArea(event: any) {
    const data = draw.value?.getAll();
    if (data && data.features.length > 0) {
      addCoordenadas(data.features);
      parseCoordinates(coordenadas.value);
      enviarCoordenadas();
    }
  }

  props.map.on('draw.create', updateArea);
  props.map.on('draw.delete', updateArea);
  props.map.on('draw.update', updateArea);

  props.map.addControl(draw.value);

  const drawControls = document.querySelectorAll('.mapboxgl-ctrl-group.mapboxgl-ctrl');
  drawControls.forEach((elem) => {
    elem.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group');
  });
}

function drawEnd() {
  if (props.map.hasControl(draw.value)) {
    props.map.removeControl(draw.value);
    draw.value = null;
  }
}

watch(
  () => mapModeStore.isDarkMode,
  (isDarkMode) => {
    applyFilterToIcons("mapbox-gl-draw_polygon", isDarkMode);
    applyFilterToIcons("mapbox-gl-draw_trash", isDarkMode);
  }
);

onMounted(() => drawInit());
onBeforeUnmount(() => drawEnd());
</script>

<style scoped>
/* Estilo para o grupo de controles */
.mapboxgl-ctrl-group {
  background-color: #f0f0f0 !important;  /* Cor de fundo */
  border-radius: 5px;  /* Borda arredondada */
  padding: 10px; /* Espaçamento interno */
}

/* Estilo para o controle específico de desenho (polygon) */
.mapboxgl-ctrl-polygon {
  background-color: #ff5733 !important;  /* Cor de fundo específica */
  color: white;  /* Cor do texto */
}

/* Estilo para o controle de lixo (trash) */
.mapboxgl-ctrl-trash {
  background-color: #d9534f !important;  /* Cor de fundo específica */
  color: white;  /* Cor do texto */
}

.mapboxgl-ctrl-group , .maplibregl-ctrl-group  {
    height: 33px;
    width: 33px;
    color: white;
}
</style>
