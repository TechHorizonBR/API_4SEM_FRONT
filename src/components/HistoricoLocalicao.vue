<template>
    <div class="container" :class="{ 'container-dark': props.isDark, 'container-light': !props.isDark }">
        <div class="header" :style="{ color: isDark ? 'white' : '#373737' }">
            <h1>Location History</h1>
            <div class="user-icon-name">
                <font-awesome-icon :icon="['fas', 'user']" class="icons" />
                <h2>User: JHONY SANTOS DE SOUZA</h2>
            </div>

            <div class="user-icon-name">
                <font-awesome-icon :icon="['fas', 'mobile']" class="icons" />
                <h2>Card: CARD_0989</h2>
            </div>

            <div class="user-icon-name">
                <font-awesome-icon :icon="['fas', 'calendar']" class="icons" />
                <h2>Date: 2024-10-23 to 2024-10-30</h2>
                <h2>{{ user?.coordenadas }}</h2>
            </div>
        </div>
        <h2 v-if="props.locations.length === 0">User has not registers.</h2>

        <div class="localizacoes-usuarios">
            <LocationBlock :isDark="props.isDark" v-for="location of props.locations" :location="location"/>
        </div>

    </div>

</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import LocationBlock from './LocationBlock.vue';
import LocatiosAPIOpenCageData from '@/services/locations';
import {type Location, type User} from '@/interfaces/types';
import { selectedUsers } from '@/stores/selectedUsers';

const props = defineProps<{
    isDark: boolean,
    locations: Location[],
    id: string
}>();

const selectedUserStore = selectedUsers();
const user = ref<User>();

onMounted(() => {
    getLocations();
    findUsuarioInStore();
})
const findUsuarioInStore = () => {
    user.value = selectedUserStore.findById(Number(props.id));
}
const getLocations = async () => {
    const response = await LocatiosAPIOpenCageData.getAddressByCoordenadas(41.0, 20.9);
    console.log(response)
}

</script>


<style scoped>
.container {
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
    /*animation: fadeInOut 3s ease-in-out;*/
}
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
  }

h1 {
    font-size: 1.2em;
    text-align: center;
    border-bottom: solid rgba(128, 128, 128, 0.744) 0.9px;
}

h2 {
    font-size: .9em;
}

.container-dark {
    background-color: #0a0012e3;
    color: white;
}

.container-light {
    background-color: #f7f7f7e6;
    color: #383838;
}

.localizacoes-usuarios {
    max-height: 60vh;
    overflow-y: auto;
}

.user-icon-name {
    display: flex;
    margin: 1% 0;

}

.user-icon-name>h2 {
    margin: 0;
}

.icons {
    margin: 0 2% 0 0;
    font-size: 1em;
}

.localizacoes-usuarios::-webkit-scrollbar {
    width: 10px;
}

.localizacoes-usuarios::-webkit-scrollbar-thumb {
    background-color: #35005d;
    border-radius: 10px;
}

.localizacoes-usuarios::-webkit-scrollbar-track {
    background-color: #8f8f8f;
}

.header {
    margin: 0 0 7% 0;
}
</style>