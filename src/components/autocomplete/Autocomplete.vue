<template>
  <div class="autocomplete">
    <div class="autocomplete-fullName div-inputs">
      <label
        class="label"
        for="name"
        :style="{ color: isDark ? '#fff' : '#000' }"
        >Name:</label
      >
      <input
        type="text"
        v-model="searchName"
        @input="handleNameInput"
        class="dropdown-input"
        placeholder="Type Username"
        :style="{
          backgroundColor: isDark ? '#383838' : '#FFF',
          color: isDark ? '#FFF' : '#000',
          border: isDark ? '1px solid #292929' : '1px solid rgb(156, 156, 156)',
        }"
      />

      <ul v-if="showNameResults" class="dropdown-menu">
        <li
          v-for="result in nameResults"
          :key="result.nome"
          @click="setSelected(result, 'name')"
          class="dropdown-item"
          :style="{backgroundColor: isDark ? '#383838' : '#FFF', 
                color: isDark ? '#FFF' : '#000'}"
          
          >
          {{ result.nome }}
        </li>
      </ul>
    </div>

    <div class="autocomplete-codeDevice div-inputs">
      <label
        class="label"
        for="deviceInfo"
        :style="{ color: isDark ? '#fff' : '#000' }"
        >Device:</label
      >
      <input
        type="text"
        v-model="searchCode"
        @input="handleCodeInput"
        class="dropdown-input"
        :style="{
          backgroundColor: isDark ? '#383838' : '#FFF',
          color: isDark ? '#FFF' : '#000',
          border: isDark ? '1px solid #292929' : '1px solid rgb(156, 156, 156)',
        }"
        placeholder="Type Name Card"
      />
      <ul v-if="showCodeResults" class="dropdown-menu">
        <li
          v-for="result in codeResults"
          :key="result.codigoDevice"
          @click="setSelected(result, 'code')"
          class="dropdown-item"
          :style="{backgroundColor: isDark ? '#383838' : '#FFF', 
                color: isDark ? '#FFF' : '#000'}">
          {{ result.codigoDevice }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface Device {
  nome: string;
  codigoDevice: string;
  idUsuario: string;
}

const props = defineProps<{
  source: Device[];
  modelValueFullName: string;
  modelValueCodeDevice: string;
  modelValueUserCode: string | number;
  isDark: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValueFullName", value: string): void;
  (e: "update:modelValueCodeDevice", value: string): void;
  (e: "update:modelValueUserCode", value: string): void;
}>();

const searchName = ref<string>(props.modelValueFullName);
const searchCode = ref<string>(props.modelValueCodeDevice);
const userCode = ref<string>("");
const showNameResults = ref<boolean>(false);
const showCodeResults = ref<boolean>(false);

const nameResults = computed(() => {
  if (searchName.value === "") {
    return [];
  }
  return props.source.filter((item) =>
    item.nome.toLowerCase().includes(searchName.value.toLowerCase()),
  );
});

const codeResults = computed(() => {
  if (searchCode.value === "") {
    return [];
  }
  return props.source.filter((item) =>
    item.codigoDevice.toLowerCase().includes(searchCode.value.toLowerCase()),
  );
});

const setSelected = (item: Device, type: "name" | "code") => {
  if (type === "name") {
    searchName.value = item.nome;
    searchCode.value = item.codigoDevice;
    userCode.value = item.idUsuario;
    emit("update:modelValueFullName", item.nome);
    emit("update:modelValueCodeDevice", item.codigoDevice);
    emit("update:modelValueUserCode", String(item.idUsuario));
  } else {
    searchCode.value = item.codigoDevice;
    searchName.value = item.nome;
    userCode.value = item.idUsuario;
    emit("update:modelValueCodeDevice", item.codigoDevice);
    emit("update:modelValueFullName", item.nome);
    emit("update:modelValueUserCode", String(item.idUsuario));
  }

  showNameResults.value = false;
  showCodeResults.value = false;
};

const handleNameInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchName.value = target.value;
  showNameResults.value = true;
  emit("update:modelValueFullName", searchName.value);
};

const handleCodeInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchCode.value = target.value;
  showCodeResults.value = true;
  emit("update:modelValueCodeDevice", searchCode.value);
};
</script>

<style scoped>
.div-inputs {
  margin: 0 0 2vh 0;
}
input {
  outline: none;
}
.label {
  font-size: 1.2em;
}
input {
  border: none;
}
.autocomplete {
  position: relative;
  display: inline-block;
  width: 100%;
}

.dropdown-input {
  width: 93%;
  padding: 9px;
  border-radius: 8px;
  font-size: 13px;
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
