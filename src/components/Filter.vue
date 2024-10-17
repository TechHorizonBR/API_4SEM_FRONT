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
  import { ref, onMounted } from 'vue';
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
  const showMessage = ref<boolean>();

  const handleUpdatePeriod = (period: { dataInicio: string | null; dataFim: string | null }) => {
    periods.value.dataInicio = period.dataInicio;
    periods.value.dataFim = period.dataFim;
  };

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
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
 }

</script>

<style scoped>
.filter {
  position: absolute;
  top: 3vh;
  left: 3vw;
  padding: 25px 40px;
  background-color: #f7f7f7;
  border-radius: 20px;
  width: 220px;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
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
h3{
  font-weight: normal;
}
.selected-users{
  margin: 15% 0 0 0;
}
</style>
