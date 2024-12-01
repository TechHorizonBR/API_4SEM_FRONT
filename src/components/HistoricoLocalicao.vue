<template>
    <div class="container" :class="{ 'container-dark': props.isDark, 'container-light': !props.isDark }">
        <div class="close">
            <font-awesome-icon :icon="['fas', 'xmark']" class="icone-button-close"
            @click="voltarFilter"/>
        </div>
        <div class="header-location" :style="{ color: isDark ? 'white' : '#373737' }">
            <h1>Location History</h1>
            <div class="user-icon-name">
                <h2>User: {{ username }}</h2>
            </div>
        </div>
        
        <h2 v-if="locations?.length === 0">User does not have registers.</h2>

        <div class="localizacoes-usuarios">
            <LocationBlock :isDark="props.isDark" v-for="location of locations" :location="location"/>
        </div>
    </div>

</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import LocationBlock from './LocationBlock.vue';
import Alerts from './Alerts.vue';
import {type Coordinate, type Location, type User} from '@/interfaces/types';
import { selectedUsers } from '@/stores/selectedUsers';
import { showComponents } from '@/stores/showComponents';

const props = defineProps<{
    isDark: boolean,
    id: string
}>();

const selectedUserStore = selectedUsers();
const user = ref<User>();
const locations = ref<Coordinate[]>();
const message = ref<string>("");
const showMessage = ref<boolean>(false);
const username = ref<string>('');
const showComponentsMode = showComponents();

onMounted(() => {
    findUsuarioInStore();
})
const findUsuarioInStore = () => {
    user.value = selectedUserStore.findById(Number(props.id));
    locations.value = user.value?.coordenadas ?? [];
    username.value = user.value?.nome ?? '';

    if(locations.value.length === 0){
        message.value = "User has not registers";
        showMessage.value = true;

        setTimeout(() =>{
            message.value = "";
            showMessage.value = false;
        }, 3000);
    }
}

const voltarFilter = () => {
    showComponentsMode.showFilter();
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
    min-width: 25vw;
}
.close{
    display: flex;
    flex-direction: row-reverse;
}
.icone-button-close:hover{
    cursor: pointer;
    color: #35005d;
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

.header-location {
    margin: 0 0 7% 0;
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