<template>
  <div v-if="showFilter" class="filter">
    <div class="filter-name" v-if="showNameFilter">
      <label class="label" for="name">Name:</label>
      <Autocomplete :source="devices" v-model="device" />
    </div>

    <div class="filter-device">
      <label class="label" for="deviceInfo">Device:</label>
      <Autocomplete :source="devices" v-model="device" />
    </div>

    <div class="filter-date" v-if="showDateFilter">
      <label class="label" for="date">Date:</label>
      <input class="input-date" type="date" id="date" v-model="filter_date" />

      <select class="filter-select" id="deviceInfo" v-model="filter_date">
        <option value="" selected disabled>Select an option</option>
        <option value="1">Last 24 hours</option>
        <option value="7">Last week</option>
        <option value="30">Last month</option>
      </select>
    </div>

    <button @click="onSearch">Search</button>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import Autocomplete from './autocomplete/Autocomplete.vue';

const props = defineProps({
  showFilter: Boolean
});

const devices = ["Ana", "Ana B", "Luis", "Maria"];
const device = ref('');
const filter_date = ref('');
const showNameFilter = ref(false);
const showDateFilter = ref(false);

const onSearch = () => {
  console.log({ device: device.value, filter_date: filter_date.value });
};
</script>

<style scoped>
.filter {
  position: absolute; /* Para que ele apareça sobre o mapa */
  top: 10%;
  left: 20%;
  transform: translateX(-50%);
  padding: 25px 40px;
  background-color: #f5f5f5;
  border-radius: 20px;
  width: 250px;
  z-index: 1000; /* Z-index elevado para garantir que apareça na frente */
  box-shadow: 5px 5px 8px #929292;
  
}

.label {
  width: 100%;
  display: block;
  margin-bottom: 6px;
  margin-top: 8px;
}

.input-date {
  width: 93%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

.filter-select {
  width: 100%;
  padding: 10px;
  margin-top: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

button {
  width: 100%;
  background-color: #35005d;
  color: white;
  padding: 12px;
  margin-top: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #3c0564;
}
</style>
