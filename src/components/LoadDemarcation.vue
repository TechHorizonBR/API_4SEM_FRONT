<template>
  <div class="load-container" :class="{'dark-load-container': isDark, 'light-load-container': !isDark }">
    <label>Demarcations</label>
    <Alerts :message="messageAlert" :show="showMessage" v-if="showMessage" />
  </div>

</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DemarcationsServices from '../services/demarcations';
import { useMapModeStore } from "@/stores/useMapMode";;

const showMessage = ref(false);
const demarcations = ref<[]>([]);
const messageAlert = ref<string>('');
const userCode = ref<string>('');

onMounted(() => {
  getDemarcationsByUser();

});

const props = defineProps<{
  userCode: string;
  isDark: boolean;
  map: any;
}>();



const getDemarcationsByUser = async () => {
  try{
    const response = await DemarcationsServices.getDemarcacoesByUsuario(Number(userCode.value));
    
    if(response === "Error"){
      showAlert("Something is wrong. Please, try again later.");
    }else{
      demarcations.value = response;
      if(demarcations.value.length === 0){
        showAlert("User does not have demarcations.");
      }
    }
  }catch(error){ 
    showAlert("Something is wrong. Please, try again later.");    
  }
}

const showAlert = (message : string) => {
  showMessage.value = true;
  messageAlert.value = message;

  setTimeout(() =>{
    showMessage.value = false;
    messageAlert.value = '';
  }, 3000);
}

</script>
<style>
.load-container {
  position: absolute;
  top: 26vh;
  left: 3vw;
  padding: 15px 25px;
  background-color: #f7f7f7cd;
  border-radius: 20px;
  z-index: 1000;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
  min-width: 25vw;
  height: 25vw;
}

.dark-load-container{
  background-color: #0a0012e3;
  color: white;
}
</style>