<template>
    <div class="container-block" :class="{ 'container-dark-block': isDark, 'container-light-block': !isDark }">
        <!-- <div class="first-block">
            <font-awesome-icon :icon="['fas', 'map-location-dot']" class="icons" />
            <h4>596.61km</h4>

            <font-awesome-icon :icon="['fas', 'clock']" class="icons clock-icon" />
            <h4>74m</h4>
        </div> -->

        <div class="locations">
            <div class="inicio-jornada">
                <div class="container-icon-data">
                    <font-awesome-icon :icon="['fas', 'map-pin']" class="icons icon-inicio" />
                    <h3 class="datas">{{ props.location.data }}</h3>
                </div>
                <p class="endereco" :class="{ 'endereco-dark': isDark, 'endereco-light': !isDark }">
                    {{ endereco }}
                </p>
            </div>

<!-- 
            <div class="fim-jornada">
                <div class="container-icon-data">
                    <font-awesome-icon :icon="['fas', 'map-pin']" class="icons icon-chegada" />
                 <h3 class="datas">{{ props.location.dataFim }}</h3>
                </div>
                <p class="endereco" :class="{ 'endereco-dark': isDark, 'endereco-light': !isDark }">
                    {{ props.location.latitudeInicio }} 
                </p>
            </div> -->

        </div>
    </div>
</template>

<script lang="ts" setup>
import {type Coordinate, type Location } from '@/interfaces/types'
import { onMounted, ref } from 'vue';
import LocatiosAPIOpenCageData from '@/services/locations';

const props = defineProps<{
    isDark: boolean,
    location: Coordinate
}>();
const endereco = ref<string>('');

onMounted(() => {
    getLocations();
})

const getLocations = async () => {
    const response = await LocatiosAPIOpenCageData.getAddressByCoordenadas(props.location.lat, props.location.lng);
    endereco.value = `${response.road} - ${response.city} / ${response.state} - ${response.country}`;
}

</script>

<style scoped>
.container-block {
    padding: 15px 20px;
    border-radius: 10px;
    max-width: 19.5vw;
    min-width: 17vw;
    margin: 0 3% 3% 0;
}

.container-dark-block {
    background-color: #383838;
}

.container-light-block {
    background-color: white;
}

.first-block {
    display: flex;
    border-bottom: solid rgba(128, 128, 128, 0.744) 0.9px;
    margin: 0 0 3% 0;
    padding: 0 0 3% 0;
    justify-content: center;
}

.icons {
    font-size: 1em;
    margin: 0 3%;
}

h4,
h3 {
    margin: 0
}

.container-icon-data {
    display: flex
}

.endereco {
    margin: 0 0 0 10%;
    font-size: .8em;
}

.inicio-jornada {
    margin: 0 0 3% 0;
}

.linha-pontilhada {
    border-left: 2px dashed rgba(128, 128, 128, 0.744);
    height: 38px;
    margin: 0 auto;
    width: 2px;
    margin-left: 25px;
    position: absolute;
    top: 3.5vh;
    left: -1.3vw;
}

.icon-inicio {
    color: #00FF00
}

.icon-chegada {
    color: #FF0000
}

.locations {
    position: relative;
}

.datas {
    font-weight: bold;
    font-size: 0.8em;
}

.endereco-dark {
    color: #8d8d8d;
}

.endereco-light {
    color: #565656;
}
</style>