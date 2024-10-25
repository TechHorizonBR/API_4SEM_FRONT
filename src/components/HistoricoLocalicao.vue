<template>
    <div class="container" :class="{'container-dark': props.isDark, 'container-light': !props.isDark}">
        <div class="header" :style="{color: isDark ? 'white' : '#373737'}">
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
            </div>
        </div>
        

        <div class="localizacoes-usuarios">
            <LocationBlock :isDark="props.isDark" />
            <LocationBlock :isDark="props.isDark" />
            <LocationBlock :isDark="props.isDark" />



        </div>
       
        
    </div>

</template>

<script lang="ts" setup>
import LocationBlock from './LocationBlock.vue';

const props = defineProps<{
    isDark: boolean
}>();


</script>


<style scoped>
.container {
    position: absolute;
    top: 3vh;
    left: 3vw;
    padding: 15px 25px;
    min-width: 21vw;
    background-color: #606060cd;
    border-radius: 20px;
    z-index: 1000;
    box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
    /*animation: fadeInOut 3s ease-in-out;*/
}
h1{
    font-size: 1.2em;
    text-align: center;
    border-bottom: solid rgba(128, 128, 128, 0.744) 0.9px;
}
h2{
    font-size: 1em;
}
.container-dark{
    background-color: #0a0012e3;
    color: white;
}
.container-light{
    background-color: #f7f7f7e6;
    color: #383838;
}
.localizacoes-usuarios{
    max-height: 60vh;
    overflow-y: auto;
}

.user-icon-name{
    display: flex;
    margin: 1% 0;

}
.user-icon-name > h2{
    margin: 0;
}
.icons{
    margin: 0 2% 0 0;
    font-size: 1.5em;
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
.header{
    margin: 0 0 7% 0;
}
</style>