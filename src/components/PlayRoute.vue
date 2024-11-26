<template>
    <div class="player-container">
        <div class="controls">
            <button id="play-pause-btn" @click="togglePlayPause">
                <font-awesome-icon :icon="['fas', 'stop']" v-if="isPlaying" />
                <font-awesome-icon :icon="['fas', 'play']" v-else />
            </button>
            <div class="progress-bar-container">
                <input type="range" id="progress-bar" min="0" :max="videoDuration" v-model.number="currentTime"
                    @input="onSeek" />
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
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";

const isPlaying = ref(false);
const animationSpeed = ref<number>(1);
const videoDuration = ref<number>(100);
const currentTime = ref<number>(0);

let animationFrameId: number | null = null;

const togglePlayPause = (): void => {
    isPlaying.value = !isPlaying.value;
    if (isPlaying.value) {
        startAnimation();
    } else {
        stopAnimation();
    }
};

const startAnimation = (): void => {
    const updateTime = (timestamp: number): void => {
        if (!isPlaying.value) return;

        currentTime.value += (animationSpeed.value / 60);
        if (currentTime.value >= videoDuration.value) {
            currentTime.value = videoDuration.value;
            stopAnimation();
        } else {
            animationFrameId = requestAnimationFrame(updateTime);
        }
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

onUnmounted(() => {
    stopAnimation();
});
watch(animationSpeed, (newSpeed) => {
    console.log(`Nova velocidade de reprodução: ${newSpeed}x`);
});
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
    animation: fadeInOut 3s ease-in-out;
    min-width: 25vw;
}

.controls {
    display: flex;
    align-items: center;
    gap: 10px;
}
.velocidade, .time{
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

.selector{
    font-size: 16px;
    padding: 5px;
    border: none;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
    width: 150px;
    text-align: center
}

.progress-bar-container {
    width: 80%;
}

#progress-bar {
    width: 100%;
    cursor: pointer;
}

</style>