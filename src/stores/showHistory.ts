import { defineStore } from "pinia";

export const showHistory = defineStore("showHistory", {
  state: () => ({
    showHistory: false,
  }),
  actions: {
    toggleMode() {
      this.showHistory = !this.showHistory;
    },
    setShowHistory(showHistory: boolean) {
      this.showHistory = showHistory;
    },
  },
});
