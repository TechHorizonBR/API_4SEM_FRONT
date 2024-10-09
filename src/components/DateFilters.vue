<template>
    <div class="filter-date" >
        <label for="" class="labels" :class="{ 'dark-mode-label' : isDark, 'light-mode-label' : !isDark }" >Information Date: </label>

        <select class="filter-select" id="deviceInfo" :class="{'dark-mode-select' : isDark, 'light-mode-select' : !isDark}" v-model="value" @change="updatePeriod">
            <option value="" selected disabled>
            Select an option
            </option>
            <option value="1">Last day</option>
            <option value="7">Last week</option>
            <option value="30">Last month</option>
        </select>
    </div>
    <p>{{ dataInicio }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
  isDark: boolean;
}>();
const emit = defineEmits(['updatePeriod']);
const value = ref<string>();
const dataInicio = ref<string | null>(null);
const dataFim = ref<string | null>(null);
const today = ref<string | null>(null);

const updatePeriod = () => {
  today.value = new Date().toISOString().split('T')[0];
  const dateObject = new Date(today.value);
  if(value.value == '1'){
    dateObject.setDate(dateObject.getDate() - 1);
  }else if(value.value == '7'){
    dateObject.setDate(dateObject.getDate() - 7);
  }else if(value.value == '30'){
    dateObject.setDate(dateObject.getDate() - 30);
  }
  dataInicio.value = dateObject.toISOString().split('T')[0];
  dataFim.value = today.value;
  emit('updatePeriod', {dataInicio: dataInicio.value, dataFim: dataFim.value});
}

</script>

<style scoped>
p{
  color: white
}
  .filter-select {
    width: 100%;
    padding: 9px;
    border: 1px solid rgb(156, 156, 156);
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    
  }
  option{
    cursor: pointer;
  }
  .labels{
    font-size: 1.2em;
  }
  .dark-mode-label{
    color: #fff;
  }
  .light-mode-label{
    color: #000;
  }
  .dark-mode-select{
    color: white;
    background-color: #383838;
    border: 1px solid #292929;
  }
  .light-mode-select{
    color: #000;
    background-color: #fff;
    border: 1px solid rgb(156, 156, 156);
  }
  
</style>