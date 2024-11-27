<template>
  <div>
    <div id="map"></div>

    <div class="close">
      <font-awesome-icon :icon="['fas', 'xmark']" class="icone-button-close" @click="voltarFilter" />
    </div>

    <div class="player-container">
      <div class="controls">
        <button id="play-pause-btn" @click="togglePlayPause">
          <font-awesome-icon :icon="['fas', 'stop']" v-if="isPlaying" />
          <font-awesome-icon :icon="['fas', 'play']" v-else />
        </button>
        <div class="progress-bar-container">
          <input
            type="range"
            id="progress-bar"
            min="0"
            :max="videoDuration"
            v-model.number="currentTime"
            @input="onSeek"
          />
        </div>
      </div>

      <div class="options">
        <div class="velocidade">
          <span>Select Speed:</span>
          <select id="speed-selector" class="selector" v-model.number="animationSpeed">
            <option :value="0.5">0.5x</option>
            <option :value="1">1x</option>
            <option :value="1.25">1.25x</option>
            <option :value="2">2x</option>
          </select>
        </div>

        <div class="time">
          <span>Select time:</span>
          <select id="time-selector" class="selector" v-model.number="videoDuration">
            <option :value="10">10 seconds</option>
            <option :value="30">30 seconds</option>
            <option :value="100">1 minute</option>
            <option :value="125">1.25 minutes</option>
            <option :value="200">2 minutes</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { showComponents } from "@/stores/showComponents";
import { ref, watch, onUnmounted } from "vue";

// Props to receive the map from parent component
const props = defineProps<{
  isDark: boolean;
  map: any;  // Expecting a map object to be passed from the parent
  userCode: string;
}>();

const isPlaying = ref(false);
const animationSpeed = ref<number>(1);
const videoDuration = ref<number>(100);
const currentTime = ref<number>(0);
const showComponentsMode = showComponents();

let animationFrameId: number | null = null;
let startTime = 0;
const geojson = ref({
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [[0, 0]],
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
    props.map.on("load", () => {
      console.log("Mapa carregado");
        props.map.addSource("line", {
          type: "geojson",
          data: geojson.value,
        });

        props.map.addLayer({
          id: "line-animation",
          type: "line",
          source: "line",
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#ed6498",
            "line-width": 5,
            "line-opacity": 0.8,
          },
        });
    });
  } else {
    console.log("Mapa não encontrado");
  }
};

const startAnimation = (): void => {
  const updateTime = (timestamp: number): void => {
    if (!isPlaying.value) return;

    // Calcula o progresso baseado na velocidade de reprodução
    currentTime.value += animationSpeed.value / 60;

    // Reinicia a animação ao atingir a duração máxima
    if (currentTime.value >= videoDuration.value) {
      currentTime.value = 0;
      geojson.value.features[0].geometry.coordinates = [[0, 0]]; // Resetando as coordenadas
    } else {
      const x = currentTime.value;
      const y = Math.sin((x * Math.PI) / 90) * 40; // Senoide para o trajeto
      geojson.value.features[0].geometry.coordinates.push([x, y]);
    }

    // Verifique se o mapa tem a fonte e atualize a camada
    const source = props.map.getSource("line");
    if (source) {
      source.setData({ ...geojson.value });
    }

    animationFrameId = requestAnimationFrame(updateTime);
  };

  animationFrameId = requestAnimationFrame(updateTime);
};

const stopAnimation = (): void => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

const onSeek = (): void => {
  console.log(`Novo tempo: ${currentTime.value}s`);
};


setupMap();

onUnmounted(() => {
  stopAnimation();
});

watch(animationSpeed, (newSpeed) => {
  console.log(`Nova velocidade de reprodução: ${newSpeed}x`);
});

const voltarFilter = () => {
  showComponentsMode.showFilter();
};
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
.time {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 5px 0 0 0;
}

#play-pause-btn {
  border: none;
  background-color: #35005d;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.selector {
  font-size: 16px;
  padding: 5px;
  border: none;
  border-radius: 3px;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
  width: 150px;
  text-align: center;
}

.progress-bar-container {
  width: 80%;
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
</style>
