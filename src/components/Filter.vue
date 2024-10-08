<template>
  <div class="filter" :style="{backgroundColor: isDark ? '#0a0012e3' : '#f7f7f7'}">
    <div class="filter-autocomplete" v-if="showAutocompleteFilter">
      <Autocomplete
        :source="devices"
        v-model:modelValueFullName="fullName"
        v-model:modelValueCodeDevice="codeDevice"
        v-model:modelValueUserCode="userCode"
        :isDark="isDark"
      />
    </div>

    <div class="filter-date" v-if="showDateFilter">
      <label class="label" for="startDate">Start Date:</label>
      <input
        class="input-date"
        type="date"
        id="startDate"
        v-model="startDate"
      />

      <label class="label" for="endDate">End Date:</label>
      <input class="input-date" type="date" id="endDate" v-model="endDate" />

      <select class="filter-select" id="deviceInfo" v-model="filter_date">
        <option value="" selected disabled>Select an option</option>
        <option value="1">Last 24 hours</option>
        <option value="7">Last week</option>
        <option value="30">Last month</option>
      </select>
    </div>

    <button @click="triggerSearch">Search</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Autocomplete from "./autocomplete/Autocomplete.vue";
import DevicesService from "../services/devices";

interface Device {
  fullName: string;
  codeDevice: string;
  userCode: string;
}

const devices = ref<Device[]>([]);
const fullName = ref<string>("");
const codeDevice = ref<string>("");
const userCode = ref<string>("");
const showAutocompleteFilter = ref<boolean>(true);
const showDateFilter = ref<boolean>(false);
const startDate = ref<string>("");
const endDate = ref<string>("");
const emit = defineEmits(["search"]);
const props = defineProps<{isDark : boolean}>();

const fetchDevices = async () => {
  try {
    devices.value = await DevicesService.getDevices();
  } catch (error) {
    console.error("Erro ao buscar dispositivos:", error);
  }
};

onMounted(() => {
  fetchDevices();
});
 
const triggerSearch = () => {
  emit("search", {
    fullName: fullName.value,
    codeDevice: codeDevice.value,
    userCode: userCode.value,
  });
};
</script>

<style scoped>
.filter {
  position: absolute;
  top: 3vh;
  left: 3vw;
  padding: 25px 40px;
  background-color: #f7f7f7;
  border-radius: 20px;
  width: 250px;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
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
.label {
  width: 100%;
  display: block;
  margin-bottom: 6px;
  margin-top: 8px;
  font-size: 20px;
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
