<template>
  <Map ref="mapComponentRef" />
  <div class="load-container" :class="{'dark-load-container': isDark, 'light-load-container': !isDark }">
    <h3
      v-if="demarcations.length > 0"  
      :class="{'mode-dark-title': isDark, 'mode-light-title': !isDark}" 
      class="title-demarcations">Demarcations:</h3>
      <h3 v-else:class="{'mode-dark-title': isDark, 'mode-light-title': !isDark}" 
      class="title-demarcations">No demarcations available</h3>
    <div class="demarcation-container" v-if="demarcations.length > 0">
      <label>
      <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
      Select all
      </label>
      <div class="data-list">

        <div
            class="demarcation"
            v-for="(demarcation, index) of demarcations"
            :key="index"
            :class="{'demarcation-dark-mode': isDark, 'demarcation-light-mode': !isDark }"
            @click="toggleCheckbox(index)"
          > 
            <h4>{{ demarcation.nome }}</h4>
            <input 
              type="checkbox" 
              v-model="selectedDemarcations[index]" 
              @change="checkIndividualSelection" 
              @click.stop
            >
          </div>

      </div>
    </div>
    <Alerts :message="messageAlert" :show="showMessage" v-if="showMessage" />
  </div>

</template>
<script setup lang="ts">
import { onMounted, ref, toRaw, onUnmounted } from 'vue';
import DemarcationsServices from '../services/demarcations';

const showMessage = ref(false);
const demarcations = ref<demarcation[]>([]);
const messageAlert = ref<string>('');
const mapComponentRef = ref();
const emit = defineEmits(["updateDemarcations"]);
const selectAll = ref(false);
const selectedDemarcations = ref<boolean[]>([]);


onMounted(() => {
  getDemarcationsByUser();
});

const toggleCheckbox = (index: number) => {
  selectedDemarcations.value[index] = !selectedDemarcations.value[index];
  checkIndividualSelection();
};

const props = defineProps<{
  userCode: string;
  isDark: boolean;
  map: any;
}>();


interface demarcation {
  id: number;
  nome: string;
  coordinate: any;
}

const getDemarcationsByUser = async () => {
  try {
    const response = await DemarcationsServices.getDemarcacoesByUsuario(Number(props.userCode));
    
    if(response === "Error") {
      showAlert("Something is wrong. Please, try again later.");
    } else {
      demarcations.value = response;
      selectedDemarcations.value = new Array(response.length).fill(false);
      
      emit('updateDemarcations', demarcations.value);
    }
  } catch(error) { 
    showAlert("Something is wrong. Please, try again later.");    
  }
}

function toggleSelectAll() {
  selectedDemarcations.value = selectedDemarcations.value.map(() => selectAll.value);

  selectedDemarcations.value.forEach((isSelected, index) => {
    if (isSelected) {
      plotPolygon(demarcations.value[index].coordinate, index);
    } else {
      removePolygon(index);
    }
  });
  emit('updateDemarcations', demarcations.value, selectedDemarcations.value);
}

function checkIndividualSelection() {
  selectAll.value = selectedDemarcations.value.every(val => val);

  selectedDemarcations.value.forEach((isSelected, index) => {
    if (isSelected) {
      plotPolygon(demarcations.value[index].coordinate, index);
    } else {
      removePolygon(index);
    }
  });

  // Emitindo o selectedDemarcations atualizado
  emit('updateDemarcations', demarcations.value, selectedDemarcations.value);
}


function removePolygon(user_id: number) {
  const sourceId = `area_${user_id}`;
  if (props.map.getLayer(sourceId)) {
    props.map.removeLayer(sourceId);
    props.map.removeSource(sourceId);
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

function plotPolygon(coordinates: number[][], user_id: number) {
  const sourceId = `area_${user_id}`;
  
  if (props.map.getLayer(sourceId)) return;

  const filtredCoordinates = toRaw(coordinates) as number[][];

  props.map.addSource(sourceId, {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [filtredCoordinates]
      },
      'properties': {}
    }
  });

  props.map.addLayer({
    'id': sourceId,
    'type': 'fill',
    'source': sourceId,
    'layout': {
      'visibility': 'visible'
    },
    'paint': {
      'fill-color': '#ff00007c',
      'fill-opacity': 0.5
    }
  });

  props.map.fitBounds([
    [
      filtredCoordinates[0][0] - 0.05,
      filtredCoordinates[1][1] - 0.05,
    ],
    [
      filtredCoordinates[0][0] + 0.05,
      filtredCoordinates[1][1] + 0.05,
    ],
  ]);
}

</script>
<style>
.load-container {
  position: absolute;
  top: 26vh;
  left: 3vw;
  padding: 15px 25px;
  background-color: #f7f7f7cd;
  border-radius: 20px;
  z-index: 1000;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
  min-width: 25vw;
  max-height: 25vw;
  margin-top: 30px;
}

.dark-load-container{
  background-color: #0a0012e3;
  color: white;
}

.data-list {
  max-height: 25vh;
  overflow-y: auto;
  margin-bottom: 10px;
}
.mode-dark-title{
  color: white;
}
.mode-light-title{
  color: black;
}

.demarcation{
  display: flex;
  justify-content: space-between;   
  border-radius: 1em; 
  margin: 10px 0 3% 0;
  padding: 5% 3%;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.174), 0 2px 6px 2px rgba(60, 64, 67, 0.048);
  height: 20px;

  align-items: center;
}
.demarcation-light-mode{
  background-color: rgba(255, 255, 255, 0.9);
}
.demarcation-dark-mode{
  background-color: #35005d;
}
</style>