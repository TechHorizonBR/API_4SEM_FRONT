import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const showComponents = defineStore("showComponents", {
  state: () => ({
    filter: false,
    history: false,
    mapMarker: false,
    addUser: false, // Adicionando o estado de addUser
  }),
  actions: {
    showFilter() {
      this.history = false;
      this.mapMarker = false;
      this.addUser = false; // Garantir que addUser esteja fechado
      setTimeout(() => {
        this.filter = true;
      }, 400);
    },
    showMapMaker() {
      this.history = false;
      this.filter = false;
      this.addUser = false; // Garantir que addUser esteja fechado
      setTimeout(() => {
        this.mapMarker = true;
      }, 400);
    },
    showHistory() {
      this.filter = false;
      this.mapMarker = false;
      this.addUser = false; // Garantir que addUser esteja fechado
      setTimeout(() => {
        this.history = true;
      }, 500);
    },
    showAddUser() { // Adicionando ação para mostrar o addUser
      this.filter = false;
      this.history = false;
      this.mapMarker = false;
      setTimeout(() => {
        this.addUser = true;
      }, 400);
    },
    esconderComponents() {
      this.filter = false;
      this.history = false;
      this.mapMarker = false;
      this.addUser = false; // Garantir que addUser esteja fechado
    }
  }
});
