// stores/useMapMode.ts
import { defineStore } from 'pinia';

export const useMapModeStore = defineStore('mapMode', {
  state: () => ({
    isDarkMode: false, // false para claro, true para dark
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
