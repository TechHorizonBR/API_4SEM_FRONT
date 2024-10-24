<template>
    <div class="container" :class="{'container-dark': props.isDark, 'container-light': !props.isDark}">
        <h1>Location History</h1>

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
    background-color: #f7f7f7cd;
    border-radius: 20px;
    z-index: 1000;
    box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
    /*animation: fadeInOut 3s ease-in-out;*/
}
h1{
    font-size: 1.2em;
}
.container-dark{
    background-color: #0a0012e3;
    color: white;
}
.container-light{
    background-color: #f7f7f7cd;
    color: black;
}
.localizacoes-usuarios{
    max-height: 75vh;
    overflow-y: auto;
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
</style>