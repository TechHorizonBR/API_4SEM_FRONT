<template>
  <div class="container">
    <div id="map"></div>
    <div class="player-container" :class="{'dark-player-container': isDark, 'light-player-container': !isDark }">
      <div class="close">
        <font-awesome-icon :icon="['fas', 'xmark']" class="icone-button-close" @click="voltarFilter" />
      </div>
      <div class="user-information">
        <div class="name-user">
          <font-awesome-icon :icon="['fas', 'person']" />
          <label>{{ userSelected?.nome }}</label>
        </div>
        
        <div class="device-user">
          <font-awesome-icon :icon="['fas', 'mobile']" />
          <label>{{ userSelected?.device }}</label>
          
          <font-awesome-icon
            :icon="['fas', 'triangle-exclamation']"
            style="color: #ff0000;"
            id="warning-device-out"
            v-if="isOutOfDemarcation"
          />
        </div>
        
      </div>
      <div class="controls">
        <button id="play-pause-btn" @click="togglePlayPause">
          <font-awesome-icon :icon="['fas', 'stop']" v-if="isPlaying" />
          <font-awesome-icon :icon="['fas', 'play']" v-else />
        </button>
        <div class="progress-bar-container">
          <input
            type="range"
            id="progress-bar"
            :min="minValue"
            :max="maxValue"
            v-model.number="currentTime"
          />
        </div>
      </div>

      <div class="options">
        <div class="velocidade">
          <font-awesome-icon :icon="['fas', 'person-running']" />
          <label>Speed:</label>
          <select id="speed-selector" class="selector" v-model.number="animationSpeed" :class="{'dark-input-selector': isDark}">
            <option :value="0.5">0.5x</option>
            <option :value="1">1x</option>
            <option :value="1.25">1.25x</option>
            <option :value="2">2x</option>
          </select>
        </div>
        <div class="demarcacoes">
          <label>
            Display demarcations
            <input type="checkbox" v-model="showDemarcation"> 
          </label>
        </div>
      </div>

    </div>
    <LoadDemarcation v-if="showDemarcation" :userCode="props.userCode" :isDark="props.isDark" :map="props.map" v-show="showDemarcation"
    @updateDemarcations="handleDemarcations"></LoadDemarcation>
  </div>
</template>

<script setup lang="ts">
import { type User } from "@/interfaces/types";
import { selectedUsers } from "@/stores/selectedUsers";
import { showComponents } from "@/stores/showComponents";
import { ref, watch, onUnmounted, onMounted } from "vue";
import LoadDemarcation from "./LoadDemarcation.vue";
import * as turf from '@turf/turf';

const props = defineProps<{
  isDark: boolean;
  map: any;
  userCode: string;
}>();

const isPlaying = ref(false);
const animationSpeed = ref<number>(1);
const currentTime = ref<number>(0);
const minValue = ref(0);
const maxValue = ref(100);
const showComponentsMode = showComponents();
const coordinates = ref<[number, number][]>([]);
const userSelected = ref<User>();
const emit = defineEmits(["removeRoute"]);
const showDemarcation = ref(false);
const demarcations = ref([]);
const selectedDemarcations = ref<boolean[]>([]);
const isOutOfDemarcation = ref<boolean>(false);

let animationFrameId: number | null = null;
let startTime = 0;

const handleDemarcations = (data: any, selectedData: boolean[]) => {
  demarcations.value = data;
  selectedDemarcations.value = selectedData;
};

const geojson = ref({
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [],
      },
    },
  ],
});

const togglePlayPause = (): void => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    startAnimation();
  } else {
    stopAnimation();
  }
};

const setupMap = (): void => {
  if (props.map) {
    if (!props.map.getSource("line")) {
      props.map.addSource("line", {
        type: "geojson",
        data: geojson.value,
      });
    }
    if (!props.map.getLayer("line-animation")) {
      props.map.addLayer({
        id: "line-animation",
        type: "line",
        source: "line",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#ba74f0",
          "line-width": 5,
          "line-opacity": 0.8,
        },
      });
    }
  } 
};
const startAnimation = (): void => {
  let index = 0;

  const updateTime = (timestamp: number): void => {
    if (!isPlaying.value || !coordinates.value?.length) return;

    const step = animationSpeed.value / 60;
    index = Math.min(index + step, coordinates.value.length - 1);
    geojson.value.features[0].geometry.coordinates = coordinates.value.slice(0, Math.floor(index) + 1);
    currentTime.value = (index / (coordinates.value.length - 1)) * maxValue.value;

    const source = props.map.getSource("line") as any;
    if (source) {
      source.setData({ ...geojson.value });
    }

    const currentPoint = turf.point(coordinates.value[Math.floor(index)]); 
    const isInsideDemarcation = demarcations.value.some((demarcation, i) => {
      const demarcationPolygon = turf.polygon([demarcation.coordinate]);

      const isSelected = selectedDemarcations.value[i];
      if (isSelected) {
        return turf.booleanPointInPolygon(currentPoint, demarcationPolygon);
      }
      return false;
    });

    if (isInsideDemarcation) {
      isOutOfDemarcation.value = false;
    } else {
      isOutOfDemarcation.value = true;
    }

    if (index >= coordinates.value.length - 1) {
      stopAnimation();
      return;
    }
    animationFrameId = requestAnimationFrame(updateTime);
  };

  requestAnimationFrame(updateTime);
};

const stopAnimation = (): void => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

onMounted(() => {
  emit("removeRoute", Number(props.userCode));
  setupMap();
  loadUserCoordinates();
});

const loadUserCoordinates = (): void => {
  const userStore = selectedUsers();
  const user = userStore.findById(Number(props.userCode));

  if(user){
    userSelected.value = user;
    userSelected.value.nome = capitalizeWords(userSelected.value.nome)
  }

  if (user?.coordenadas) {
    coordinates.value = user.coordenadas.map((element: { lat: number; lng: number }) => [
      element.lng,
      element.lat,
    ]);
  }
};
const capitalizeWords = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase()); 
};


const addCoordenadasInMapUnMounted = () => {
  const routeId = `route${userSelected.value?.id}`;

        props.map.addSource(routeId, {
            type: "geojson",
            data: {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: coordinates.value,
                },
            },
        });

        props.map.addLayer({
            id: routeId,
            type: "line",
            source: routeId,
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": "#ba74f0",
                "line-width": 4,
            },
        });
}
onUnmounted(() => {
  stopAnimation();
  removeAllPolygons();
  addCoordenadasInMapUnMounted();

});

const voltarFilter = (): void => {
  showComponentsMode.showFilter();
};

function removeAllPolygons() {
  demarcations.value.forEach((_, index) => {
    const sourceId = `area_${index}`;
    if (props.map.getLayer(sourceId)) {
      props.map.removeLayer(sourceId);
      props.map.removeSource(sourceId);
    }
  });
}
</script>

<style scoped>
.player-container {
  position: absolute;
  top: 3vh;
  left: 3vw;
  padding: 15px 25px;
  background-color: #f7f7f7cd;
  border-radius: 20px;
  z-index: 1000;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
  min-width: 25vw;
}

.controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.velocidade,
.time{
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 5px 0 0 0;
}

.name-user, .device-user{
  display: flex;
  gap: 10px;
}
.device-user{
  margin: 6px 0;
}
.velocidade{
  justify-content: end;
  margin: 0 !important;
  color: gray;
  font-size: 0.8em;
}
#play-pause-btn {
  border: none;
  background-color: #35005d;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.selector {
  font-size: 0.9em;
  padding: 3px;
  border: none;
  border-radius: 3px;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
  width: 60px;
  text-align: center;
}

.progress-bar-container {
  width: 100%;
}

#progress-bar {
  width: 100%;
  cursor: pointer;
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

.close {
  display: flex;
  flex-direction: row-reverse;
}

.icone-button-close:hover {
  cursor: pointer;
  color: #35005d;
}

.dark-player-container{
  background-color: #0a0012e3;
  color: white;
}
.light-player-container{
  color: black
}
.dark-input-selector{
  background-color: #383838;
  color: white;
}
label{
  font-size: 1.2
}
.user-information{
  margin: -16px 0 5px 0;
}

.demarcacoes{
  margin-right: 10px;
  display: flex;
  justify-content: end;
  margin: 0 !important;
  color: gray;
  font-size: 0.8em;
}


</style>