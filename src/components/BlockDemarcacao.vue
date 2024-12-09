<template>
  <div :class="isDark ? 'mode-dark' : 'mode-light'" class="container">
    <h4 class="name-demarcation">{{ name }}</h4>
    <div class="buttons-options">
      <font-awesome-icon
        :icon="['fas', 'trash']"
        class="icones-buttons"
        title="Remove Demarcation"
        @click="deleteById"
      />
      <font-awesome-icon
        :icon="['fas', 'eye']"
        class="icones-buttons"
        title="See Demarcation"
        @click="showDemarcation"
      />
    </div>
    <Alerts :message="messageAlert" :show="showMessage" v-if="showMessage" />
  </div>
</template>

<script setup lang="ts">
import DemarcationService from "@/services/demarcations";
import { ref } from "vue";
import Alerts from "./Alerts.vue";
import { coordinates } from "@maptiler/sdk";

const props = defineProps<{
  isDark: boolean;
  name: string;
  id: number;
  coordinates: [];
}>();

const emit = defineEmits(["updateList", "sendCoordinates"]);

const showMessage = ref<boolean>(false);
const messageAlert = ref<string>("");

const deleteById = async () => {
  const response = await DemarcationService.deleteById(props.id);

  if (response === "Demarcation has been deleted") {
    emit("updateList", props.id);
  }
};

const showDemarcation = () => {
  emit("sendCoordinates", props.coordinates, props.id);
};
const showAlert = (message: string) => {
  showMessage.value = true;
  messageAlert.value = message;

  setTimeout(() => {
    showMessage.value = false;
    messageAlert.value = "";
  }, 3000);
};
</script>

<style scoped>
.name-demarcation {
  margin: 0 0 0 3%;
}
.mode-dark {
  color: white;
  background-color: #383838;
}
.mode-light {
  color: black;
  background-color: white;
}
.container {
  display: flex;
  justify-content: space-between;
  border-radius: 1em;
  margin: 0 0 3% 0;
  padding: 5% 3%;
  box-shadow:
    0 1px 2px rgba(60, 64, 67, 0.174),
    0 2px 6px 2px rgba(60, 64, 67, 0.048);
}
.mode-dark > button {
  background-color: #383838;
  color: white;
}
.mode-light > button {
  background-color: white;
}
.buttons-options {
  display: flex;
  align-items: center;
  font-size: 1.2em;
  margin: 0 6% 0 0;
}
.icones-buttons {
  margin: 0 15%;
}
.icones-buttons:hover {
  cursor: pointer;
  color: #35005d;
}
.name {
  font-size: 1em;
  max-width: 130px;
  min-width: 130px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
