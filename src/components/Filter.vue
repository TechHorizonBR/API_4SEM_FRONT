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
    <DateFilters :isDark="isDark"/>

    <button @click="triggerSearch">Search</button>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import Autocomplete from './autocomplete/Autocomplete.vue';
  import DevicesService from '../services/devices';
  import DateFilters from '../components/DateFilters.vue';

interface Device {
  fullName: string;
  codeDevice: string;
  userCode: string;
}


  const devices = ref<Device[]>([]);
  const fullName = ref<string>('');
  const codeDevice = ref<string>('');
  const userCode = ref<string>('');
  const showAutocompleteFilter = ref<boolean>(true);
  const emit = defineEmits(['search']);
  const props = defineProps<{isDark : boolean}>();
  const periods = ref<{dataInicio: string | null, dataFim: string | null}>();

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
  position: absolute;
    top: 3vh;
    left: 3vw;
    padding: 25px 40px;
    background-color: #f7f7f7;
    border-radius: 20px;
    width: 250px;
    z-index: 1000;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  /*  box-shadow: 5px 5px 8px #929292;*/
}

.label {
  width: 100%;
  display: block;
  margin-bottom: 6px;
  margin-top: 8px;
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
