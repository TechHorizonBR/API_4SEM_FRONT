<template>
    <div class="filter">
      <form @submit.prevent="onSearch">
        <div class="filter-name">
          <label class="label-select" for="name">Name:</label>
          <select id="name">
            <option value="" selected disabled>
              Select an option
            </option>
            <option v-for="device in deviceList" :key="device.idClient" :value="device">
              {{ device.fullName }}
            </option>
          </select>
        </div>

        <div class="filter-device">
          <label class="label-select" for="deviceInfo">Device:</label>
          <select id="deviceInfo">
            <option value="" selected disabled>
              Select an option
            </option>
            <option v-for="device in deviceList" :key="device.idDevice" :value="device">
              {{ device.codeDevice }}
            </option>
          </select>
        </div>

        <div class="filter-date" v-if="showDateFilter">
          <label class="label-select" for="date">Date:</label>
          <input class="input-date" type="date" id="date" />

          <select id="deviceInfo">
            <option value="" selected disabled>
              Select an option
            </option>
            <option value="1">
              Last 24 hours
            </option>
            <option value="7">
              Last week
            </option>
            <option value="30">
              Last month
            </option>
          </select>
        </div>

        <button type="submit">Search</button>
      </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const showDateFilter = ref(false);

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

  .label-select {
    display: block;
    margin-bottom: 8px;
  }

  .input-date {
    width: 93%;
  }

  input,
  select {
    width: 100%;
    padding: 8px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  button {
    width: 100%;
    background-color: #35005D;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  button:hover {
    background-color: #3c0564;
  }
</style>

