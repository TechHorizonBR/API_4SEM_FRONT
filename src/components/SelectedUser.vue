<template>
    <div :class="isDark ? 'selected-user-dark' : 'selected-user-light'" class="selected-user">
        <p id="iniciais" :style="{backgroundColor: props.cicleColor, color: 'black'}">{{ workingOnName.iniciais }}</p>
        <p class="name">{{ workingOnName.name }}</p>
        <button @click="removeUser">X</button>
    </div>

</template>

<script lang="ts" setup>
import type { Color } from '@maptiler/sdk';
import { computed } from 'vue';


 const props = defineProps<{
    nameUser: string,
    isDark: boolean,
    cicleColor: string
 }>();

 const emit = defineEmits(['removeUser']);

 const removeUser = () => {
    emit('removeUser', props.nameUser)
 }
 
 const workingOnName = computed(() => {
    const nameParts = props.nameUser.split(' ');
    const names = props.nameUser.split(' ');
    const firstName = names[0];
    const secondName = names[1];
   
    return {name: nameParts.slice(0, 2).join(' '), iniciais: firstName[0]+secondName[0]};
});


 </script>

<style scoped>
 .selected-user-dark{
   color: white;
   background-color: #383838;
 }
 .selected-user-light{
   color: black;
   background-color: white;
 }
 .selected-user{
   display: flex;
   justify-content: space-evenly;   
   border-radius: 1em; 
   margin: 0 0 3% 0;
 }
 button{
   cursor: pointer;
   border: none;
    
 }
 .selected-user-dark > button{
   background-color: #383838;
   color: white
 }
 .selected-user-light > button{
   background-color: white;
 }
 .name{
   font-size: 1em;
   max-width: 130px;
   min-width: 130px;
   text-align: left;
   white-space: nowrap;       /* Evita que o texto quebre a linha */
   overflow: hidden;          /* Esconde o texto que ultrapassar o limite */
   text-overflow: ellipsis;
 }
 #iniciais{
   background: blue;
   padding: 0.1em;
   border-radius: 50%;
   width: 20px;
   text-align: center;
   height: 20px;
 }
</style>