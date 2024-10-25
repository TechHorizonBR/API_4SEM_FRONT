<template>
  <div></div> <!-- Não precisa de UI visível -->
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

export default defineComponent({
  name: 'DrawPolygon',
  props: {
    map: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const draw = ref<MapboxDraw | null>(null);

    function drawInit() {
      draw.value = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
      });

      props.map.addControl(draw.value);

      const drawControls = document.querySelectorAll('.mapboxgl-ctrl-group.mapboxgl-ctrl');
      drawControls.forEach((elem) => {
        elem.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group');
      });
    }

    function drawEnd() {
      if (draw.value) {
        props.map.removeControl(draw.value);
        draw.value = null;
      }
    }

    onMounted(() => drawInit());
    onBeforeUnmount(() => drawEnd());

    return { drawInit, drawEnd };
  },
});
</script>

<style scoped></style>
