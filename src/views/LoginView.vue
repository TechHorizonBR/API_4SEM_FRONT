<template>
  
  <div class="gray-background">
    <Login/>
  </div>
  <MapBackground/>
  
</template> 

<script setup lang="ts">
import MapBackground from '@/components/MapBackground.vue';
import Login from '@/components/Login.vue';

</script>

<style scoped>
.gray-background {
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  z-index: 2;
  position: absolute;
}
</style>