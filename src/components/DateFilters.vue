<template>
    <div class="filter-date" >
        <label for="" class="labels" :class="{ 'dark-mode-label' : isDark, 'light-mode-label' : !isDark }" >Information Date: </label>

        <div class="periods" :class="{ 'dark-mode-radios' : isDark, 'light-mode-radios' : !isDark }">
            <div class="radios">
              <input type="radio" name="today-radio" id="today-radio" value="1" v-model="value">
              <label for="today-radio">Last day</label>
            </div>
            
            <div class="radios">
              <input type="radio" name="week-radio" id="week-radio" value="7" v-model="value">
              <label for="week-radio">Last Week</label>
            </div>
            
            <div class="radios">
              <input type="radio" name="month-radio" id="month-radio" value="30" v-model="value">
              <label for="month-radio">Last Month</label>
            </div>
            
            <div class="radios">
              <input type="radio" name="year-radio" id="year-radio" value="365" v-model="value">
              <label for="year-radio">Last Year</label>
            </div>
            
            
        </div>

    </div>
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
  }
  if(value.value == '7'){
    dateObject.setDate(dateObject.getDate() - 7);
  }
  if(value.value == '30'){
    dateObject.setDate(dateObject.getDate() - 30);
  }

  if(value.value == '365'){
    dateObject.setDate(dateObject.getDate() - 365);
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
  .dark-mode-radios > div > label{
    color: white;
  }
  .light-mode-radios > div > label{
    color: black;
  }
  
</style>