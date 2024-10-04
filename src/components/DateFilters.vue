<template>
    <div class="filter-date" >
        <label for="" class="labels" :class="{ 'dark-mode-label' : isDark, 'light-mode-label' : !isDark }" >Information Date: </label>
        <!--<label class="label" for="startDate">Start Date:</label>
        <input class="input-date" type="date" id="startDate" v-model="startDate"/>

        <label class="label" for="endDate">End Date:</label>
        <input class="input-date" type="date" id="endDate" v-model="endDate"/>-->

        <select class="filter-select" id="deviceInfo" :class="{'dark-mode-select' : isDark, 'light-mode-select' : !isDark}">
            <option value="" selected disabled>
            Select an option
            </option>
            <option value="1">Last 24 hours</option>
            <option value="7">Last week</option>
            <option value="30">Last month</option>
        </select>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
  isDark: boolean;
}>();

</script>

<style scoped>
  .filter-select {
    width: 100%;
    padding: 10px;
    margin-top: 16px;
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