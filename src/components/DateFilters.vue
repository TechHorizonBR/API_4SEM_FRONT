<template>
  <div class="filter-date">
    <label
      for=""
      class="labels"
      :class="{ 'dark-mode-label': isDark, 'light-mode-label': !isDark }"
    >
      Information Date:
    </label>

    <div class="periods" :class="{ 'dark-mode-radios': isDark, 'light-mode-radios': !isDark }">
      <div class="radios">
        <input type="radio" name="today-radio" id="today-radio" value="1" v-model="value" @change="updatePeriod">
        <label for="today-radio">Last Day</label>
      </div>

      <div class="radios">
        <input type="radio" name="week-radio" id="week-radio" value="7" v-model="value" @change="updatePeriod">
        <label for="week-radio">Last Week</label>
      </div>

      <div class="radios">
        <input type="radio" name="month-radio" id="month-radio" value="30" v-model="value" @change="updatePeriod">
        <label for="month-radio">Last Month</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps<{
  isDark: boolean;
}>();
const emit = defineEmits(["updatePeriod", "resetDateFilters"]);
const value = ref<string | undefined>(undefined);
const dataInicio = ref<string | null>(null);
const dataFim = ref<string | null>(null);
const today = ref<string | null>(null);

// Função para atualizar o período
const updatePeriod = () => {
  today.value = new Date().toISOString().split("T")[0];
  const dateObject = new Date(today.value);
  
  if (value.value === "1") {
    dateObject.setDate(dateObject.getDate() - 1);
  } else if (value.value === "7") {
    dateObject.setDate(dateObject.getDate() - 7);
  } else if (value.value === "30") {
    dateObject.setDate(dateObject.getDate() - 30);
  }

  dataInicio.value = dateObject.toISOString().split('T')[0];
  dataFim.value = today.value;
  
  emit("updatePeriod", {
    dataInicio: dataInicio.value,
    dataFim: dataFim.value,
  });
};

// Escuta o evento de reset e redefine o valor do rádio
watch(() => emit('resetDateFilters'), () => {
  value.value = undefined;
});
</script>

<style scoped>
.labels {
  font-size: 1.2em;
}
.dark-mode-label {
  color: #fff;
}
.light-mode-label {
  color: #000;
}
.dark-mode-radios > div > label {
  color: white;
}
.light-mode-radios > div > label {
  color: black;
}
</style>
