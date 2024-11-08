<template>
  <div class="filter" :class="{'mapMarker-Dark': props.isDark, 'mapMarker-Light': !props.isDark}" >
    <div class="title" :class="{'titule-Dark': isDark, 'titule-Light': !isDark}" >

      <Autocomplete
        :source="devices"
        v-model:modelValueFullName="fullName"
        v-model:modelValueCodeDevice="codeDevice"
        v-model:modelValueUserCode="userCode"
        :isDark="isDark"
      />
    </div>
    <div class="data-list" :class="{'list-Dark': isDark, 'list-Light': !isDark}" >
      <ul>
      </ul>
    </div>
    <div class="title2" :class="{'title2-Dark': isDark, 'title2-Light': !isDark}" >
    </div>

    <div class="data-marker">
      <div class="text-label" :class="{'textL-Dark': isDark, 'textL-Light': !isDark}" >
        <label for="area-name">Demarcation name:</label><br>
        <input
          type="text" 
          id="area-name" 
          v-model="areaName" 
          class="label-style" 
          placeholder="Type New Area Name"
          :style="{
          backgroundColor: isDark ? '#383838' : '#FFF',
          color: isDark ? '#FFF' : '#000',
          border: isDark ? '1px solid #292929' : '1px solid rgb(156, 156, 156)',
          }"
        />
      </div>
      
      <div class="buttons">
        <button @click="initDraw">Create New Area</button>
        <button @click="saveDemarcation">Save Area</button>
        <button @click="getDemarcationsByUser">Search By User</button>

      </div>
      <DrawPolygon v-if="showDraw" :map="map" ref="drawPolygon" @enviarCoordenadas="recebeCoordenadas"/>
    </div>
    <Alerts :message="messageAlert" :show="showMessage" v-if="showMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DrawPolygon from './DrawPolygon.vue';
import Autocomplete from './autocomplete/Autocomplete.vue';
import DevicesService from '../services/devices';
import DemarcationsServices from '../services/demarcations';
import Alerts from './Alerts.vue';

const savedData = ref<[]>([]);
const areaName = ref('');
const userName = ref('');
const showDraw = ref(false);
const initDraw = () =>   {showDraw.value = true};
const devices = ref<Device[]>([]);
const fullName = ref<string>('');
const codeDevice = ref<string>('');
const userCode = ref<string>('');
const showMessage = ref<boolean>(false);
const messageAlert = ref<string>('');

interface Device {
    fullName: string;
    codeDevice: string;
    userCode: string;
  }

async function saveDemarcation () {
  try {
    if( !userCode.value ) {
      showAlert("Please select an user.");
      return;
    }

    if (areaName.value.trim() === '') {
      showAlert("Please enter the name of the demarcation.");
      return;
    }
    
    if( savedData.value.length === 0) {
      showAlert("Please select the area.");
      return;
    }


    const  data = {nome: String(areaName.value), usuarioId: Number(userCode.value), coordinates:savedData.value}
    const response = await DemarcationsServices.create(data); 
    
  } catch (error) {
    showAlert("Something is wrong. Please try again later.");
  }
} 

function recebeCoordenadas(coordenadas:any){
  savedData.value = coordenadas;
  console.log(savedData.value);
}

const fetchDevices = async () => {
    try {
      devices.value = await DevicesService.getDevices();
    } catch (error) {
      console.error("Erro ao buscar dispositivos:", error);
    }
  };

const props = defineProps<{
  isDark: boolean,
  map: Object
}>();

onMounted(() => { 
  fetchDevices();
})

const getDemarcationsByUser = async () => {
  try{
    const response = await DemarcationsServices.getDemarcacoesByUsuario(Number(userCode.value));
    
    if(response === "Error"){
      showAlert("Something is wrong. Please, try again later.");
    }else{
      console.log(response);
    }
  }catch(error){ 
    showAlert("Something is wrong. Please, try again later.");    
  }
}

const showAlert = (message : string) => {
  showMessage.value = true;
  messageAlert.value = message;

  setTimeout(() =>{
    showMessage.value = false;
    messageAlert.value = '';
  }, 3000);
}

</script>

<style scoped>
.filter {
  position: absolute;
  width: 330px;
  height: 540px;
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

.titule-Dark{
  color: white;
}

.data-list {
  border: 2px inset rgba(0, 0, 0, 0.192);
  height: 35%;
  overflow-y: auto;
  margin-bottom: 10px;
}

.list-Dark{
  background-color: #383838;
}

.title2 {
  text-align: center;
}

.title2-Dark {
  color: white;
}

.text-label{
  font-size: 1.2em;
}

.textL-Dark{
  color: white
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
