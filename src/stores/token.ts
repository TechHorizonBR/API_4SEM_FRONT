import { defineStore } from "pinia";

export const tokenStore = defineStore("tokenStore", {
  state: () => ({
    token: "",
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
    },
  },
});
