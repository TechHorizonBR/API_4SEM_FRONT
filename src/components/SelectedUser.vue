<template>
    <div :class="isDark ? 'selected-user-dark' : 'selected-user-light'" class="selected-user">
        <p id="iniciais" :style="{backgroundColor: props.cicleColor, color: 'black'}">{{ workingOnName.iniciais }}</p>
        <p class="name">{{ workingOnName.name }}</p>
        <div class="buttons-options">
          <font-awesome-icon :icon="['fas', 'trash']" class="icones-buttons" title="Remove User" @click="removeUser"/>
          <font-awesome-icon :icon="['fas', 'map']" class="icones-buttons" title="See location history" @click="showHistoryPanelFunction"/>
         
        </div>
    </div>

</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { showComponents } from '@/stores/showComponents';

 const props = defineProps<{
    nameUser: string,
    isDark: boolean,
    cicleColor: string, 
    idUser: string
 }>();
 const showComponentsMode = showComponents();

 const showHistoryPanelFunction = () => {
  emit('sendId', props.idUser);
  showComponentsMode.showHistory();
 }
 const emit = defineEmits(['removeUser', 'sendId']);

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
 .selected-user-dark > button{
   background-color: #383838;
   color: white
 }
 .selected-user-light > button{
   background-color: white;
 }
 .buttons-options{
  display: flex;
  align-items: center;
  font-size: 1.2em;
 }
 .icones-buttons{
  margin: 0 15%;
 }
 .icones-buttons:hover{
  cursor: pointer;
  color: #35005d;
 }
 .name{
   font-size: 1em;
   max-width: 130px;
   min-width: 130px;
   text-align: left;
   white-space: nowrap;
   overflow: hidden;
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