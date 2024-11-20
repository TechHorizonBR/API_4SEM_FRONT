import { defineStore } from "pinia";

export const token = defineStore("token", {
    state: () =>({
        token: ''
    }),
    actions: {
        setToken(token : string){
            this.token = token;
        }
    }
})