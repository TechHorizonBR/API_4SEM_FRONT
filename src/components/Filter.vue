<template>

  <div class="filter" :style="{backgroundColor: isDark ? '#0a0012e3' : '#f7f7f7cd'}">
    <!--<h2 :class="isDark ? 'title-filter-dark' : 'title-filter-light'" class="title-filter">LocalTracker</h2>-->

    <div class="filter-autocomplete" v-if="showAutocompleteFilter">
      <Autocomplete
        :source="devices"
        v-model:modelValueFullName="fullName"
        v-model:modelValueCodeDevice="codeDevice"
        v-model:modelValueUserCode="userCode"
        :isDark="isDark"
      />
    </div>

    <!-- Campo de Filtro de Período de Datas -->
    <div class="date-range-filter">
      <label for="date-range" class="label-position-time" :style="{color: isDark ? 'white' : 'black'}">Position Time Range:</label>
      <input :class="isDark ? 'input-data-dark' : 'input-data-light'"
        type="text"
        id="date-range"
        ref="dateRangePicker"
        @change="handleDateRangeChange"
        placeholder="Select Date Range"
      />
    </div>


    <DateFilters 
      :isDark="isDark"
      @updatePeriod="handleUpdatePeriod" />

    <button @click="triggerSearch">Search</button>

    <div class="selected-users">
      <h3 v-if="selectedUsers.length !== 0" :class=" isDark ? 'labelDark' : 'labelLight'">
        Selected Users
      </h3>
      <div class="users-scrool">
        <SelectedUser v-for="user in selectedUsers" 
        :nameUser="user.nameUser"
        :isDark="isDark" 
        :cicle-color="user.cicleColor"
        @removeUser="handleRemoveUser" />
      </div>
    </div>

    <p v-if="showMessage">
      Usuário já selecionado
    </p>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, nextTick } from 'vue';
  import flatpickr from 'flatpickr'; // Biblioteca para seleção de data
  import 'flatpickr/dist/flatpickr.css'; // Estilo para flatpickr
  import Autocomplete from './autocomplete/Autocomplete.vue';
  import DevicesService from '../services/devices';
  import DateFilters from '../components/DateFilters.vue';
  import SelectedUser from './SelectedUser.vue';

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
  const emit = defineEmits(['search', 'removeUser']);
  const props = defineProps<{isDark : boolean}>();
  const periods = ref<{ dataInicio: string | null, dataFim: string | null }>({
    dataInicio: null,
    dataFim: null
  });
  const selectedUsers = ref<Array<{
    nameUser: string,
    cicleColor: string
  }>>([]);
  const showMessage = ref<boolean>(false);

  const dateRangePicker = ref<HTMLInputElement | null>(null);

  // Variável de controle da data selecionada
  const selectedDate = ref<string | null>(null);

const fetchDevices = async () => {
  try {
    devices.value = await DevicesService.getDevices();
  } catch (error) {
    console.error("Erro ao buscar dispositivos:", error);
  }
};
const handleDateRangeChange = (selectedDates: any) => {
  if (selectedDates.length === 2) {
    periods.value.dataInicio = selectedDates[0].toISOString().split('T')[0];
    periods.value.dataFim = selectedDates[1].toISOString().split('T')[0];
    console.log("Data de Início:", periods.value.dataInicio);
    console.log("Data de Fim:", periods.value.dataFim);
  }
};

onMounted(async () => {
  await fetchDevices();
  
  // Inicializando flatpickr para intervalo de datas
  nextTick(() => {
    if (dateRangePicker.value) {
      flatpickr(dateRangePicker.value, {
        mode: "range",
        dateFormat: "Y-m-d",
        onChange: handleDateRangeChange
      });
    }
  });
});

  const handleDateChange = () => {
    console.log("Selected date:", selectedDate.value);
  };

  const handleUpdatePeriod = (period: { dataInicio: string | null; dataFim: string | null }) => {
    periods.value.dataInicio = period.dataInicio;
    periods.value.dataFim = period.dataFim;
  };

  const triggerSearch = () => {

  if(selectedUsers.value.some(user => user.nameUser === fullName.value)){
      showMessage.value = true;
      setTimeout(() => {
          showMessage.value = false;
      }, 3000);
  }else{
    const color = generateRandomColor()
    selectedUsers.value.push({
      nameUser: fullName.value,
      cicleColor: color
    });
    emit("search", {
      fullName: fullName.value,
      codeDevice: codeDevice.value,
      userCode: userCode.value,
      dataInicio: periods.value.dataInicio,
      dataFim: periods.value.dataFim,
      selectedDate: selectedDate.value, // Data selecionada incluída na pesquisa
      cicleColor: color
    });
  }  
};

  const handleRemoveUser = (username: string) => {
    const index = selectedUsers.value.findIndex(user => user.nameUser === username);

    if(index !== -1){
      selectedUsers.value.splice(index, 1);
    }
  }
  const generateRandomColor = () => {
    const red = Math.floor(Math.random() * 56 + 200).toString(16);  // Valores altos para vermelho
  const green = Math.floor(Math.random() * 56 + 200).toString(16); // Valores altos para verde
  const blue = Math.floor(Math.random() * 56 + 200).toString(16);  // Valores altos para azul

  return `#${red.padStart(2, '0')}${green.padStart(2, '0')}${blue.padStart(2, '0')}`;
 }

</script>

<style scoped>
.filter {
  position: absolute;
  top: 3vh;
  left: 3vw;
  padding: 15px 25px;
  background-color: #f7f7f7cd;
  border-radius: 20px;
  z-index: 1000;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
}

.date-range-filter {
  margin-bottom: 15px;
}

.date-range-filter input {
  width: 93%;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
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

.label-position-time{
  font-size: 1.2em;
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
.labelDark{
  color: white;
}
.labelLight{
  color: black;
}
.input-data-dark{
  background-color: #383838;
  color: white;
  border: none;
}
.input-data-light{
  background-color: white;
  color: black;
  border: 1px solid rgb(156, 156, 156);
}

h3{
  font-weight: normal;
}
.selected-users{
  margin: 15% 0 0 0;
}

/* Estilo para o campo de data */
.date-filter {
  margin-bottom: 15px;
}

.date-filter input {
  width: 93%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgb(156, 156, 156);
  font-size: 14px;
}

.users-scrool{
  overflow-y: auto;
  max-height: 25vh;
}

.users-scrool::-webkit-scrollbar {
  width: 10px; /* Define a largura da barra de rolagem */
}

/* Estilo da parte "ativa" da barra de rolagem (thumb) */
.users-scrool::-webkit-scrollbar-thumb {
  background-color: #35005d; /* Cor escura */
  border-radius: 10px; /* Bordas arredondadas para um visual mais suave */
}

.users-scrool::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}
.title-filter-dark{
  color: white;
}
.title-filter-light{
  color: #35005d
}
.title-filter{
  text-align: center;
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 2.3em;
}
h1{
  text-align: center;
}
</style>
