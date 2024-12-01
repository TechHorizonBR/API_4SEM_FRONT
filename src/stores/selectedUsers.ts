import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { type User, type Coordinate } from "../interfaces/types";

export const selectedUsers = defineStore("selectedUser", {
  state: () => ({
    users: [] as User[],
  }),
  actions: {
    addUser(user: User) {
      this.users.push(user);
    },
    removeUser(id: number) {
      const index = this.users.findIndex((user) => user.id === id);
      if (index !== -1) {
        this.users.splice(index, 1);
      }
    },
    addCoordenadas(idUser: number, coordenadas: Coordinate[]) {
      const user = this.users.find((user) => user.id == idUser);

      if (user) {
        for (let coordenada of coordenadas) {
          user.coordenadas.push(coordenada);
        }
      }
    },
    findById(idUser : number){
      return this.users.find(user => user.id == idUser);
    },
    findAllIds(){
      return this.users;
    }
    
  },
});
