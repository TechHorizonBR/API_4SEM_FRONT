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
        user: {} as Object | null
    }),
    actions: {
        setUser(user: Object | null){
            this.user = user;
        }
    }
})
