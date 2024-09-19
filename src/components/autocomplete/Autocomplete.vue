<template>
  <div class="teste">
    <input type="text" :value="modelValue" @input="handleInput" class="dropdown-input">
    <ul v-if="searchResults.length" class="dropdown-menu">
      <li
        v-for="result in searchResults"
        :key="result"
        @click="setSelected(result)"
        class="dropdown-item">
        {{ result }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

  const props = defineProps({
    source: {
      type: Array,
      required: true,
      default: () => []
    },
    modelValue: String
  })

  const emit = defineEmits(['update:modelValue'])

  const search = ref('')

  const searchResults = computed(() => {
    if (search.value === '') {
      return []
    }

    return props.source.filter(item => {
      return item.toLowerCase().includes(search.value.toLowerCase())
    })
  })

  const setSelected = item => {
    search.value = item
    emit('update:modelValue', search.value)
    search.value = '';
  }

  const handleInput = event => {
    search.value = event.target.value
    emit('update:modelValue', search.value)
  }
</script>

<style scoped>
  .teste {
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
