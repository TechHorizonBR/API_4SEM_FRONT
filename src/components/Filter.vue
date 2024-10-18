<template>

  <div class="filter" :style="{backgroundColor: isDark ? '#0a0012e3' : '#f7f7f7'}">
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
    <DateFilters :isDark="isDark" @updatePeriod="handleUpdatePeriod" />

    <button @click="triggerSearch">Search</button>


    <div :class="{'selected-users' : selectedUsers.length !== 0}">
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
      emit('removeUser', index);
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
  padding: 25px 40px;
  background-color: white;
  border-radius: 20px;
  z-index: 1000;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
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
