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

export const userStore = defineStore("userStore", {
  state: () => ({
    user: {},
  }),
  actions: {
    setUser(user: Object) {
      this.user = user;
    },
  },
});
