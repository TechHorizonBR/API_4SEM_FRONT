<template>
  <div class="filter" :class="{'mapMarker-Dark': props.isDark, 'mapMarker-Light': !props.isDark}" >
    <div class="title">
      <h3>Saved Areas:</h3>
    </div>
    <div class="data-list">
      <ul>

      </ul>
    </div>
    <div class="title2">
      <h3>New Area</h3>
    </div>

    <div class="data-marker">
      <div class="text-label">
        <label for="area-name">Name:</label><br>
        <input type="text" id="area-name" v-model="areaName" class="label-style" placeholder="Type New Area Name"/>
      </div>
      <div class="text-label">
        <label for="user-name">User Name:</label><br>
        <input type="text" id="user-name" v-model="userName" class="label-style" placeholder="Type Linked Username"/>
      </div>
      <div class="buttons">
        <button @click="selectArea">Select Area</button>
        <button @click="saveData">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const savedData = ref([]);
const areaName = ref('');
const userName = ref('');
const props = defineProps<{
  isDark: boolean,
}>();

</script>

<style scoped>
.filter {
  position: absolute;
  width: 330px;
  height: 473px;
  top: 3vh;
  left: 3vw;
  padding: 20px 20px;
  background-color: #f7f7f7cd;
  border-radius: 20px;
  z-index: 1000;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
  animation: fadeInOut 3s ease-in-out;
}

.mapMarker-Dark{
  background: #0a0012e3;
}

.data-list {
  border: 2px inset rgba(0, 0, 0, 0.192);
  height: 35%;
  overflow-y: auto;
  margin-bottom: 10px;
}

.title2 {
  text-align: center;
}

.text-label{
  font-size: 1.2em;
}

.data-marker{
  width: 100%;
}

.label-style {
  width: 93%;
  padding: 9px;
  border-radius: 8px;
  font-size: 13px;
  border: 1px solid #ccc; /* Exemplo de estilo para borda */
  margin-bottom: 6px;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #35005d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #3c0564;
}

.buttons{
  margin-top: 5px;
}

.fade-enter-active {
  animation: fadeInUp 0.3s ease-out;
}

.fade-leave-active {
  animation: fadeOutDown 0.3s ease-in forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}

</style>
