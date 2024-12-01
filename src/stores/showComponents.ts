import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const showComponents = defineStore("showComponents", {
  state: () => ({
    filter: false,
    history: false,
    mapMarker: false,
    addUser: false,
    playRouter: false,
  }),
  actions: {
    showFilter() {
      this.history = false;
      this.mapMarker = false;
      this.addUser = false;
      this.playRouter = false;
      setTimeout(() => {
        this.filter = true;
      }, 400);
    },
    showMapMaker() {
      this.history = false;
      this.filter = false;
      this.addUser = false;
      this.playRouter = false;
      setTimeout(() => {
        this.mapMarker = true;
      }, 400);
    },
    showHistory() {
      this.filter = false;
      this.mapMarker = false;
      this.addUser = false;
      this.playRouter = false;
      setTimeout(() => {
        this.history = true;
      }, 500);
    },
    showAddUser() {
      this.filter = false;
      this.history = false;
      this.mapMarker = false;
      this.playRouter = false;
      setTimeout(() => {
        this.addUser = true;
      }, 400);
    },
    showPlayRouter(){
      this.filter = false;
      this.history = false;
      this.mapMarker = false;
      this.addUser = false;
      setTimeout(() => {
        this.playRouter = true;
      }, 400);
    },
    esconderComponents() {
      this.filter = false;
      this.history = false;
      this.mapMarker = false;
      this.addUser = false;
      this.playRouter = false;
    }
  }
});
