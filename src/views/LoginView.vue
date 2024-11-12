<template>
<div class="gray-background"></div>
      <MapBackground></MapBackground>
  
</template> 

<script setup lang="ts">
import MapBackground from '@/components/MapBackground.vue';

</script>

<style scoped>
.gray-background {
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  position: absolute;
}
</style>