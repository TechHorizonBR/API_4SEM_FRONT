import { defineStore } from "pinia";

export const useMapModeStore = defineStore("mapMode", {
  state: () => ({
    isDarkMode: true,
  }),
  actions: {
    toggleMode() {
      this.isDarkMode = !this.isDarkMode;
    },
    setDarkMode(isDark: boolean) {
      this.isDarkMode = isDark;
    },
  },
});
