<template>
  <div class="container">
    <div class="box" :class="{'containerDark':isDark, 'containerLight':!isDark}">
      <h1 class="title">User System Manager</h1>
      <div class="block0">

        <div class="block1">
          <button @click="findUser" class="sidebar-button">Find By Username</button>
          <button @click="createUser" class="sidebar-button">Create User</button>
          <button @click="updateUser" class="sidebar-button">Update User</button>
          <button @click="closeAddUser" class="sidebar-button" id="bClose">Close</button>
        </div>

        <div class="block2">
          <div class="blockForm">
            <div class="fline1" :class="{'blockDark':isDark, 'blockLight':!isDark}">
              <div class="case1">
                <label for="username">Username:</label>
                <input type="text" id="username" placeholder="Type the username"  v-model="user.username"/>
              </div>
              
              <div class="case2">
                <label for="role">Role:</label>
                <select :class="{'usernameDark':isDark, 'usernameLight':!isDark}" id="role" v-model="user.role">
                  <option disabled value="">Select one role</option>
                  <option value="ROLE_ADMIN">Admin</option>
                  <option value="ROLE_CLIENTE">User</option>
                </select >
              </div>
            </div>

            <div class="fline2">
              <div class="case3">
                <label for="password">Password:</label>
                <input type="password" id="password" :class="{'usernameDark':isDark, 'usernameLight':!isDark}" placeholder="Type the password" />
              </div>
              <div class="case3">
                <label for="confirm-password">Confirm the Password:</label>
                <input type="password" id="confirm-password" :class="{'usernameDark':isDark, 'usernameLight':!isDark}" placeholder="Confirm the password" />
              </div>
            </div>
          </div>
          <div class="table-container">
          <table :class="{'tableDark':isDark, 'tableLight':!isDark}">
            <thead>
              <tr>
                <th>Username</th>
                <th>Password</th>
                <th>Role</th>
                <th>CreatedAt</th>
                <th>ModifiedAt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.username">
                <td>{{ user.username }}</td>
                <td>{{ user.password }}</td>
                <td>{{ user.role }}</td>
                <td>{{ user.createdAt }}</td>
                <td>{{ user.modifiedAt }}</td>
                <td>
                  <button @click="updateUser(usuario)">Atualizar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import apiClient from '@/services/axiosConfig'; 
  import RegistroService from '@/services/registros';
  import { userStore } from '@/stores/token';

export default {
  data() {
    return {
      usuarios: [],
      usuario: "",
      user: {
        id:'',
        username: '',
        password: '',
        role: "",
      },
      confirmPassword: '',
      users: [] // Lista de usuários
    };
  },
  methods: {

    async getAllUsers() {
      try {
        const todosUsuarios = await registros.getAllUsers();
        this.usuarios = todosUsuarios;
        console.log(this.usuarios);
      } catch (error) {
        console.error(error);
      }
    },

    findUser() {
      // Função para buscar usuário
    },
    createUser() {
      // Função para criar usuário
    },
    updateUser() {

      
      if (this.user.password !== this.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      

      const userId = userStore().user.id;

      // Dados a serem enviados para o backend
      const userUpdateData = {
        id: userId,
        username: this.user.username,
        password: this.user.password,
        role: this.user.role
      };

      const userData={
        id: this.usuario.id,
        name: this.user.username,
        role: this.user.role
      }

      apiClient.patch(`/usuarios/update-user?id=${userUpdateData.id}`, userData)
        .then(response => {
          const updatedUser = response.data;

          // Atualiza a lista de usuários no frontend
          const index = this.users.findIndex(user => user.username === updatedUser.username);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }

          // Limpa o formulário após a atualização
          this.user = { id:null, username: "", password: "", role: "" };
          this.confirmPassword = "";

          alert("User updated successfully!");
        })
        .catch(error => {
          console.error("Error updating user:", error);
          alert("Failed to update user.");
        });
    },
    closeAddUser() {
      // Função para fechar a adição de usuário
    }
  },
  mounted(){
    const getUsuarios = async() =>{
      try{
        const allUsers = await RegistroService.getAllUsers();
        console.log("USUARIOS:", allUsers);
      }catch(error){
        console.error("Erro:", error);
      }
    }

    getUsuarios();

    console.log(userStore().user);
    this.getAllUsers();
  }
};
</script>

<style scoped>
/* Estilos para centralizar o retângulo */
.container {
  display: flex;
  justify-content: center;
  height: 89%;
  width: 100%;
  position: absolute;
  z-index: 10000;
  top: 0vh;
  align-items: center;
}

.containerDark {
  background: #0a0012e3;
  color:white
}

.containerLight {
  background-color: #f7f7f7cd;
}

.fline1, .fline2{
  display: grid;
  grid-template-columns: 2fr 2fr;
  gap: 2rem;
  margin-bottom: 2%;
  margin-top: 3%;
}

.usernameDark{
  background-color: rgb(56, 56, 56);
  color: rgb(255, 255, 255);
  border: 1px solid rgb(41, 41, 41);
}

.box {
  width: 75%;
  height: 72%;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  top: 28px;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15) 
}

/* Título no canto superior esquerdo */
.title {
  font-size: 1.2em;
  margin: 0;
}

.block0{
  display: flex;
  flex-direction: row;
  width: 102%;
  height: 98%;
}

.block1{
  width: 20%;
  margin-top: 2%;
}

.block2 {
  display: flex;
  flex-direction: column;
  margin-left: 8%;
  width: 67%;
}

.case1{
  display: flex;
  flex-direction: column;
}

.case2{
  display: flex;
  flex-direction: column;
}

.case3{
  display: flex;
  flex-direction: column;
}

.case4{
  display: flex;
  flex-direction: column;
}

.blockForm{
  margin-bottom: 15px;
}

.tableDark{
  border: 1px solid rgba(211, 210, 210, 0.703);
}

.sidebar-button {
  width: 100%;
  padding: 10px;
  margin-bottom: 25%;
  border: none;
  cursor: pointer;
  font-size: 14px;
  margin-top: 12%;
  display: block;
  background-color: #35005d;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.sidebar-button:hover {
  background-color: #5c0ea3;
}

label {
  margin-bottom: 5px;
}

input, select {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid rgb(156, 156, 156);
}

table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid rgba(0, 0, 0, 0.265);
    }
    th {
        background-color: #000;
        border: 1px solid #fff;
        padding: 8px;
        text-align: left;
        color: white;
    }
    td {
        padding: 8px;
        text-align: left;
    }

#bClose {
  margin-top: 105%;
}

.fade-enter-active {
  animation: fadeInUp 0.3s ease-out;
}

.fade-leave-active {
  animation: fadeOutDown 0.3s ease-in forwards;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}
</style>
