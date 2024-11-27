<template>
  <div class="filter" :style="{backgroundColor: isDark ? '#0a0012e3' : '#f7f7f7cd'}">
    <div class="filter-autocomplete" v-if="showAutocompleteFilter">
      <Autocomplete
        :source="devices"
        v-model:modelValueFullName="fullName"
        v-model:modelValueCodeDevice="codeDevice"
        v-model:modelValueUserCode="userCode"
        :isDark="isDark"
      />
    </div>

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
      @updatePeriod="handleUpdatePeriod"
      @resetDateFilters="handleResetDateFilters"
      ref="dateFilterVariavel" 
    />

    <div class="buttons-filters">
      <button @click="triggerSearch">Search</button>
      <button @click="cleanFields">Clear</button>
    </div>
    <Alerts :message="message" :show="showMessage" class="alert-popup" />

    <div class="selected-users" v-if="selectedUsers.length !== 0">
      <h3 :class=" isDark ? 'labelDark' : 'labelLight'">
        Selected Users
      </h3>
      <div class="users-scrool">
        <SelectedUser v-for="user in selectedUsers" 
        :nameUser="user.nameUser"
        :isDark="isDark" 
        :cicle-color="user.cicleColor"
        @removeUser="handleRemoveUser" 
        @send-id="receiveId"
        :idUser="user.userCode" />
      </div>
    </div>
    <Alerts :message="messageEmpty" :show="showMessageEmpty" class="alert-popup" />

   
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, nextTick } from 'vue';
  import flatpickr from 'flatpickr';
  import 'flatpickr/dist/flatpickr.css';
  import Autocomplete from './autocomplete/Autocomplete.vue';
  import DevicesService from '../services/devices';
  import DateFilters from '../components/DateFilters.vue';
  import SelectedUser from './SelectedUser.vue';
  import Alerts from './Alerts.vue';
  import { selectedUsers as selectedUserStore} from '@/stores/selectedUsers';
  import { showComponents } from '@/stores/showComponents';
  import PlayRoute from './PlayRoute.vue';
  // VARIAVEIS
  interface Device {
    fullName: string;
    codeDevice: string;
    userCode: string;
  }
  const showComponentsStore = showComponents();
  const devices = ref<Device[]>([]);
  const fullName = ref<string>('');
  const codeDevice = ref<string>('');
  const userCode = ref<string>('');
  const showAutocompleteFilter = ref<boolean>(true);
  const emit = defineEmits(['search', 'removeUser', 'resetDateFilters', 'sendId']);
  const props = defineProps<{isDark : boolean, messageEmpty: string, showMessageEmpty: boolean, map: any}>();
  const periods = ref<{ dataInicio: string | null, dataFim: string | null }>({
    dataInicio: null,
    dataFim: null
  });
  const selectedUsers = ref<Array<{
    nameUser: string,
    cicleColor: string,
    userCode: string
  }>>([]);
  const dateFilterVariavel = ref<InstanceType<typeof DateFilters> | null>(null);
  const showMessage = ref<boolean>(false); // Variável de controle para exibir a mensagem
  const message = ref<string>(''); // Variável que armazena a mensagem a ser exibida
  const dateRangePicker = ref<HTMLInputElement | null>(null);
  const selectedDate = ref<string | null>(null);
  const selectedUsersStore = selectedUserStore();

  // MÉTODOS
  const fetchDevices = async () => {
    try {
      devices.value = await DevicesService.getDevices();
    } catch (error) {
      console.error("Erro ao buscar dispositivos:", error);
    }
  };
  const receiveId = (idUser: string) =>{
    emit('sendId', idUser);
  }
  const handleDateRangeChange = (selectedDates: any) => {
    if (selectedDates.length === 2) {
      periods.value.dataInicio = selectedDates[0].toISOString().split('T')[0];
      periods.value.dataFim = selectedDates[1].toISOString().split('T')[0];
    }
  };

  const updateFlatpickrDates = () => {
    if (dateRangePicker.value) {
      const picker = flatpickr(dateRangePicker.value, {
        mode: "range",
        dateFormat: "Y-m-d",
        onChange: handleDateRangeChange
      });

      const startDate = periods.value.dataInicio ? new Date(periods.value.dataInicio) : null;
      const endDate = periods.value.dataFim ? new Date(periods.value.dataFim) : null;

      if (startDate && endDate) {
        picker.setDate([startDate, endDate], true);
      } else {
        picker.clear();
      }
    }
  };

  onMounted(async () => {
    await fetchDevices();
    
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
  
  const handleUpdatePeriod = (period: { dataInicio: string | null; dataFim: string | null }) => {
    periods.value.dataInicio = period.dataInicio;
    periods.value.dataFim = period.dataFim;
    updateFlatpickrDates();
  };

  const triggerSearch = () => {
    if (!fullName.value || !periods.value.dataFim || !periods.value.dataInicio || !userCode.value) {
      message.value = 'All fields must be completed!';
      showMessage.value = true; // Exibir mensagem de alerta
      setTimeout(() => {
        showMessage.value = false; // Esconder mensagem de alerta após 3 segundos
      }, 3000);
    } else {
      if (selectedUsers.value.some(user => user.nameUser === fullName.value)) {
        message.value = 'Usuário already has selected!';
        showMessage.value = true;
        setTimeout(() => {
          showMessage.value = false;
        }, 3000);
      } else {
        const color = generateRandomColor();
        selectedUsers.value.push({
          nameUser: fullName.value,
          cicleColor: '#35005d',
          userCode: userCode.value
        });
        emit("search", {
          fullName: fullName.value,
          codeDevice: codeDevice.value,
          userCode: userCode.value,
          dataInicio: periods.value.dataInicio,
          dataFim: periods.value.dataFim,
          selectedDate: selectedDate.value,
          cicleColor: color
        });

        handleResetDateFilters();

        cleanFields();

        if (dateRangePicker.value) {
          const picker = flatpickr(dateRangePicker.value);
          picker.clear();
        }
        updateFlatpickrDates();
      }
    }
  };
  const handleResetDateFilters = () => {
  periods.value.dataInicio = null;
  periods.value.dataFim = null;
};

  const handleRemoveUser = (username: string) => {
    const index = selectedUsers.value.findIndex(user => user.nameUser === username);
    if (index !== -1) {
      const userCodeToRemove = selectedUsers.value[index].userCode;
      selectedUsers.value.splice(index, 1);
      selectedUsersStore.removeUser(Number(userCodeToRemove));
      emit('removeUser', index, userCodeToRemove);
    }
  };

  const generateRandomColor = () => {
    const red = Math.floor(Math.random() * 56 + 200).toString(16);
    const green = Math.floor(Math.random() * 56 + 200).toString(16);
    const blue = Math.floor(Math.random() * 56 + 200).toString(16);
    return `#${red.padStart(2, '0')}${green.padStart(2, '0')}${blue.padStart(2, '0')}`;
  };
  const cleanFields = () =>{
    fullName.value = '';
    codeDevice.value = '';
    userCode.value = '';
    periods.value.dataInicio = null;
    periods.value.dataFim = null;
    dateFilterVariavel.value?.clearField();
    if (dateRangePicker.value) {
      const picker = flatpickr(dateRangePicker.value);
      picker.clear();
    }
    updateFlatpickrDates();
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
    animation: fadeInOut 3s ease-in-out;
    min-width: 25vw;
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

  .label-position-time {
    font-size: 1.2em;
  }

  button {
    width: 47%;
    background-color: #35005d;
    color: white;
    padding: 12px;
    margin: 16px 0 0 0;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  button:hover {
    background-color: #3c0564;
  }

  .labelDark {
    color: white;
  }

  .labelLight {
    color: black;
  }

  .input-data-dark {
    background-color: #383838;
    color: white;
    border: 1px solid #ffffff45;
  }

  .input-data-light {
    background-color: white;
    color: black;
    border: 1px solid #00000020;
  }

  .selected-users {
    margin-top: 20px;
  }
  
  .users-scrool {
    max-height: 200px;
    overflow-y: auto;
  }

  .fade-enter-active {
  animation: fadeInUp 0.3s ease-out;
}

.fade-leave-active {
  animation: fadeOutDown 0.3s ease-in forwards;
}
.buttons-filters{
  display: flex;
  justify-content: space-between;
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
.users-scrool::-webkit-scrollbar {
  width: 10px;
}
.users-scrool::-webkit-scrollbar-thumb {
  background-color: #35005d;
  border-radius: 10px;
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
