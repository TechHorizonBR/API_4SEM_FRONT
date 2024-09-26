<template>
  <div class="autocomplete">
    <div class="autocomplete-fullName">
      <label class="label" for="name">Name:</label>
      <input
        type="text"
        v-model="searchName"
        @input="handleNameInput"
        class="dropdown-input"
      />
      <ul v-if="showNameResults" class="dropdown-menu">
        <li
          v-for="result in nameResults"
          :key="result.fullName"
          @click="setSelected(result, 'name')"
          class="dropdown-item">
          {{ result.fullName }}
        </li>
      </ul>
    </div>

    <div class="autocomplete-codeDevice">
      <label class="label" for="deviceInfo">Device:</label>
      <input
        type="text"
        v-model="searchCode"
        @input="handleCodeInput"
        class="dropdown-input"
      />
      <ul v-if="showCodeResults" class="dropdown-menu">
        <li
          v-for="result in codeResults"
          :key="result.codeDevice"
          @click="setSelected(result, 'code')"
          class="dropdown-item">
          {{ result.codeDevice }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';

  interface Device {
    fullName: string;
    codeDevice: string;
  }

  const props = defineProps<{
    source: Device[];
    modelValueFullName: string;
    modelValueCodeDevice: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValueFullName', value: string): void;
    (e: 'update:modelValueCodeDevice', value: string): void;
  }>();

  const searchName = ref<string>(props.modelValueFullName);
  const searchCode = ref<string>(props.modelValueCodeDevice);
  const showNameResults = ref<boolean>(false);
  const showCodeResults = ref<boolean>(false);

  const nameResults = computed(() => {
    if (searchName.value === '') {
      return [];
    }
    return props.source.filter(item => item.fullName.toLowerCase().includes(searchName.value.toLowerCase()));
  });

  const codeResults = computed(() => {
    if (searchCode.value === '') {
      return [];
    }
    return props.source.filter(item => item.codeDevice.toLowerCase().includes(searchCode.value.toLowerCase()));
  });

  const setSelected = (item: Device, type: 'name' | 'code') => {
    if (type === 'name') {
      searchName.value = item.fullName;
      searchCode.value = item.codeDevice;
      emit('update:modelValueFullName', item.fullName);
      emit('update:modelValueCodeDevice', item.codeDevice);
    } else {
      searchCode.value = item.codeDevice;
      searchName.value = item.fullName;
      emit('update:modelValueCodeDevice', item.codeDevice);
      emit('update:modelValueFullName', item.fullName);
    }

    showNameResults.value = false;
    showCodeResults.value = false;
  };

  const handleNameInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    searchName.value = target.value;
    showNameResults.value = true;
    emit('update:modelValueFullName', searchName.value);
  };

  const handleCodeInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    searchCode.value = target.value;
    showCodeResults.value = true;
    emit('update:modelValueCodeDevice', searchCode.value);
  };
</script>

<style scoped>
  .autocomplete {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .dropdown-input {
    width: 93%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
  }

  .dropdown-menu {
    position: absolute;
    width: 100%;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 5px;
    padding: 0;
    z-index: 1000;
    max-height: 200px;
    overflow-y: auto;
    list-style-type: none;
  }

  .dropdown-item {
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    background-color: white;
    border-bottom: 1px solid #f1f1f1;
  }

  .dropdown-item:hover {
    background-color: #f0f0f0;
  }

  .dropdown-item:last-child {
    border-bottom: none;
  }
</style>
