<template>
  <div class="filter">
    <div class="filter-autocomplete" v-if="showAutocompleteFilter">
      <Autocomplete :source="devices"
        v-model:modelValueFullName="fullName"
        v-model:modelValueCodeDevice="codeDevice"
      />
    </div>

    <div class="filter-date" v-if="showDateFilter">
      <label class="label" for="startDate">Start Date:</label>
      <input class="input-date" type="date" id="startDate" v-model="startDate"/>

      <label class="label" for="endDate">End Date:</label>
      <input class="input-date" type="date" id="endDate" v-model="endDate"/>

      <select class="filter-select" id="deviceInfo" v-model="filter_date">
        <option value="" selected disabled>
          Select an option
        </option>
        <option value="1">Last 24 hours</option>
        <option value="7">Last week</option>
        <option value="30">Last month</option>
      </select>
    </div>

    <button @click="onSearch">Search</button>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import Autocomplete from './autocomplete/Autocomplete.vue';
  import DevicesService from '../services/devices';

  interface Device {
    fullName: string;
    codeDevice: string;
  }

  const devices = ref<Device[]>([]);
  const fullName = ref<string>('');
  const codeDevice = ref<string>('');
  const showAutocompleteFilter = ref<boolean>(true);
  const showDateFilter = ref<boolean>(false);
  const startDate = ref<string>('');
  const endDate = ref<string>('');

  const fetchDevices = async () => {
    try {
      devices.value = await DevicesService.getDevices();
    } catch (error) {
      console.error('Erro ao buscar dispositivos:', error);
    }
  };

  onMounted(() => {
    fetchDevices();
  });
</script>

<style scoped>
  .filter {
    padding: 25px 40px;
    background-color: #f5f5f5;
    border-radius: 20px;
    width: 250px;
    margin: 0 auto;
    box-shadow: 5px 5px 8px #929292
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
    background-color: #35005D;
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

