<template>
  <div class="container" :class="{ 'fundo-dark': isDark, 'fundo-light': !isDark }">
    <div class="box" :class="{ 'containerDark': isDark, 'containerLight': !isDark }">

      <div class="block0">

        <div class="side-bar">
          <div class="container-title">
            <div class="quadrado">
              <font-awesome-icon icon="fa-solid fa-gear" />
            </div>
            <h1 class="title">User System Manager</h1>
          </div>

          <ur class="options-sidebar" :class="{ 'side-bar-dark': isDark, 'side-bar-light': !isDark }">
            <li><a id="button-create-user" class="button-page" :class="{ 'button-page-dark': isDark }" @click="toggleIsVisibleCreateUser">
                <font-awesome-icon :icon="['fas', 'user-plus']" class="icone-button-close" />
                Create User</a></li>
            <li><a id="button-see-all-users" class="button-page" :class="{ 'button-page-dark': isDark }" @click="toggleIsVisibleAllUsers">
                <font-awesome-icon :icon="['fas', 'eye']" class="icone-button-close" />
                See all users</a></li>
            <li><a class="button-page" :class="{ 'button-page-dark': isDark }" @click="closeAddUser" id="bClose">
                <font-awesome-icon :icon="['fas', 'xmark']" class="icone-button-close" />
                Close</a></li>
          </ur>
        </div>

        <div class="block2">
          <div class="blockForm" v-if="isVisibleCreateUser">
            <h3 class="title-pages">Create User - LocalTracker</h3>
            <div class="fline1">
              <div class="case1">
                <label for="name">Username:</label>
                <input type="text" id="name" placeholder="Type the username" v-model="usuario.username"
                  :class="{ 'input-dark': isDark }" />
              </div>
              <div class="case2">
                <label for="name">Name:</label>
                <input type="text" id="name" placeholder="Type the name" v-model="usuario.name"
                  :class="{ 'input-dark': isDark }" />
              </div>
            </div>

            <div class="fline2">
              <div class="case3">
                <label for="password">Password:</label>
                <input type="password" id="password" placeholder="Type the password" v-model="usuario.password"
                  :class="{ 'input-dark': isDark }" />
              </div>
              <div class="case3">
                <label for="confirm-password">Confirm the Password:</label>
                <input type="password" id="confirm-password" placeholder="Confirm the password"
                  v-model="confirmPassword" :class="{ 'input-dark': isDark }" />

              </div>
            </div>
            <h5 id="passwordmatch" v-if="showPasswordMatch">{{ passwordMatchMessage }}</h5>


            <div class="fline2">
              <div class="case3">
                <label for="role">Role:</label>
                <select id="role" v-model="usuario.role" class="select-role" :class="{ 'input-dark': isDark }">
                  <option value="ROLE_ADMIN">ADMIN</option>
                  <option value="ROLE_CLIENTE">CLIENTE</option>
                </select>
              </div>
              <div class="div-button">
                <a class="create-button" @click="createUser">Cadastrar</a>

              </div>



            </div>

          </div>
          <div class="allusers" v-if="isVisibleAllUsers">
            <h3 class="title-pages">All Users - LocalTracker</h3>
            <div class="forms-search">
              <label for="name">Username:</label>
              <div class="function">
                <input type="text" id="name" placeholder="Type the username" v-model="usuario.username"
                :class="{ 'input-dark': isDark }" />
              <a class="search-button">Search</a>
              </div>
              
            </div>


            <div class="table-container">


              <table :class="{ 'tableDark': isDark, 'tableLight': !isDark }">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th>Modified At</th>
                    <th>Created By</th>
                    <th>Modified By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(usuario, index) in usuarios" :key="usuario.id">
                    <td>{{ usuario.id }}</td>
                    <td>
                      <input v-if="usuario.isEditing" v-model="usuario.name"
                        :class="{ 'nameDark': isDark, 'nameLight': !isDark }" />
                      <span v-else>{{ usuario.name }}</span>
                    </td>
                    <td>{{ usuario.username }}</td>
                    <td>
                      <select v-if="usuario.isEditing" v-model="usuario.role"
                        :class="{ 'usernameDark': isDark, 'usernameLight': !isDark }" class="select-role">
                        <option disabled selected>Select one role</option>
                        <option value="ROLE_ADMIN">ADMIN</option>
                        <option value="ROLE_CLIENTE">CLIENTE</option>
                      </select>
                      <span v-else>{{ usuario.role }}</span>
                    </td>
                    <td>{{ usuario.createdAt }}</td>
                    <td>{{ usuario.modifiedAt }}</td>
                    <td>{{ usuario.createdBy }}</td>
                    <td>{{ usuario.modifiedBy }}</td>
                    <td>
                      <button v-if="usuario.isEditing" @click="saveUser(usuario)" class="sidebar-button">Save</button>
                      <button v-else @click="editUser(usuario)" class="sidebar-button">Edit</button>
                      <button @click="removeUser(usuario)" class="sidebar-button">Remove</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
  <Alerts :message="messageAlert" :show="showMessage" v-if="showMessage" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import registros from "@/services/registros";
import UserSysService from "@/services/UserSys";
import apiClient from "@/services/axiosConfig";
import { userStore } from "@/stores/token";
import Alerts from "./Alerts.vue";
import { showComponents } from "@/stores/showComponents";
const showMessage = ref<boolean>(false);
const messageAlert = ref<string>("");


const isVisibleCreateUser = ref<boolean>(false);
const isVisibleAllUsers = ref<boolean>(false)
const usuarios = ref<any[]>([]);
const passwordMatchMessage = ref<string>('');
const showPasswordMatch = ref<boolean>(false);

const usuario = ref({
  name: '',
  username: '',
  password: '',
  role: ''
});

const confirmPassword = ref('');

const toggleIsVisibleCreateUser = () => {
  isVisibleCreateUser.value = true;
  isVisibleAllUsers.value = false;

};
const showAlert = (message: string) => {
  showMessage.value = true;
  messageAlert.value = message;

  setTimeout(() => {
    showMessage.value = false;
    messageAlert.value = "";
  }, 3000);
};
const toggleIsVisibleAllUsers = () => {
  isVisibleAllUsers.value = true;
  isVisibleCreateUser.value = false;

};

const closeAddUser = () => {
  const closeComponent = showComponents()
  closeComponent.esconderComponents()
};

const props = defineProps<{
  isDark: boolean
}>();

watch(
  () => confirmPassword.value,
  (confirmPassword) => {
    if (confirmPassword === null || usuario.value.name === null) {
      showPasswordMatch.value = false;
      return;
    }
    if (confirmPassword !== usuario.value.password) {
      passwordMatchMessage.value = "Passwords não correspondem";
      showPasswordMatch.value = true;
    } else {
      passwordMatchMessage.value = "";
      showPasswordMatch.value = false;
    }
  }
);

const createUser = async () => {


  if (
    !usuario.value.name ||
    !usuario.value.username ||
    !usuario.value.password ||
    !usuario.value.role
  ) {
    showAlert("All fields are required!");
    return;
  }

  try {
    const response = await UserSysService.createUser(usuario.value);

    if (response) {
      showAlert("User created successfully!");
      resetForm();
      getAllUsersSys();
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

const getAllUsersSys = async () => {
  try {
    const todosUsuarios = await registros.getAllUsers();
    usuarios.value = todosUsuarios.map((usuario: any) => ({
      ...usuario,
      isEditing: false, // Adicionando isEditing a todos os usuários ao carregar
    }));
  } catch (error) {
    console.error(error);
  }
};

const editUser = (usuario: any) => {
  usuario.isEditing = true; // Ativar modo de edição
};

const saveUser = async (usuario: any) => {
  try {
    // Envia os dados atualizados
    const userData = {
      id: usuario.id,
      name: usuario.name,
      role: usuario.role
    };

    const updatedUser = await UserSysService.updateUser(userData);

    if (updatedUser) {
      usuario.isEditing = false; // Desativa o modo de edição
      showAlert("User has been changed successfully!");
      getAllUsersSys(); // Recarrega os usuários após atualização
    }
  } catch (error) {
    console.error("Erro ao editar o usuário:", error);
    showAlert("Erro ao tentar editar o usuário");
  }
};

const removeUser = async (usuario: any) => {
  if (!confirm(`Are you sure you want to remove user "${usuario.username}"?`)) {
    return;
  }
  try {
    await UserSysService.removeUser(usuario.username);

    usuarios.value = usuarios.value.filter(
      (u) => u.username !== usuario.username,
    );
    showAlert(`User "${usuario.username}" removed successfully!`);
  } catch (error) {
    console.error("Error deleting user:", error);
    showAlert("Erro ao tentar remover o usuário");
  }
};

const resetForm = () => {
  usuario.value.username = '';
  usuario.value.password = '';
  usuario.value.role = '';
  usuario.value.name = ''
  confirmPassword.value = '';
};

onMounted(() => {
  isVisibleAllUsers.value = true;
  getAllUsersSys();

  const getUsuarios = async () => {
    try {
      const allUsers = await registros.getAllUsers();
      console.log("USUARIOS:", allUsers);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  getUsuarios();

  console.log(userStore().user);
  getAllUsersSys();

});
</script>

<style scoped>
.container-title {
  display: flex;
  align-items: center;
  font-size: 1em;
  gap: 5px
}

.quadrado {
  background-color: #5c0ea3;
  color: white;
  padding: 8px;
  border-radius: 3px;
}

.title {
  font-size: 1em;
  margin: 0
}

.container {
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 10000;
  top: 0;
  align-items: flex-start;
}
.fundo-light{
  background-color: #ffffff42;
}
.fundo-dark{
  background-color: #1e013542;
}
#passwordmatch {
  color: red
}

.box {
  display: flex;
  min-width: 70vw;
  height: 70vh;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  top: 8vh;
  flex-direction: column;
}

.case1 {
  display: flex;
  flex-direction: column;
}

.case2 {
  display: flex;
  flex-direction: column;
}

.case3 {
  display: flex;
  flex-direction: column;
}

.case4 {
  display: flex;
  flex-direction: column;
}

.containerDark {
  background-color: #0a0012e3;
  color: white
}

.containerLight {
  background-color: #fff;
}

.block0 {
  display: flex;
  width: 100%;
}

.side-bar {
  padding-right: 20px;
  width: 15vw;
  border-right: #a2a2a29d 1px solid;
  height: 70vh;
}
.allusers{
  margin-left: 15px;
  margin-top: 25px;
}
.block2 {
  flex: 3;

  flex: 1 1 250px 500px;
}

.table-container {
  max-width: 800px;
  max-height: 350px;
  overflow: auto;
  border-radius: 10px;
  margin-top: 20px;
}

.fline1,
.fline2 {
  display: grid;
  grid-template-columns: 2fr 2fr;
  margin-bottom: 2%;
  margin-top: 3%;
}

.usernameDark {
  background-color: rgb(56, 56, 56);
  color: rgb(255, 255, 255);
  border: 1px solid rgb(41, 41, 41);
}

.blockForm {
  margin-bottom: 15px;
  margin-left: 15px;
}

.select-role {
  width: 21.5vw;
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
  border-radius: 8px;
  background-color: #5c0ea3;
  color: white;
  cursor: pointer;
  text-align: center;
}

.create-button {
  padding: 10px;
  border: none;
  font-size: 14px;
  border-radius: 8px;
  background-color: #5c0ea3;
  color: white;
  cursor: pointer;
}
.search-button{
  padding: 10px;
    border: none;
    font-size: 14px;
    border-radius: 8px;
    background-color: #5c0ea3;
    color: white;
    margin-left: 10px;
    cursor: pointer;
    width: 10vw;
    text-align: center;
}

.create-button:hover {
  background-color: #892ede;
}

.sidebar-button:hover {
  background-color: #5c0ea3;
}

label {
  margin-bottom: 5px;
}

input,
select {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid rgb(156, 156, 156);
}

input {
  width: 20vw;
}

.edit-button {
  width: auto;
  padding: 6px 12px;
  font-size: 12px;
  background-color: #5c0ea3;
}

.edit-button:hover {
  background-color: #5c0ea3;
}

.side-bar-dark {
  color: white
}

.side-bar-light {
  color: rgb(66, 66, 66);
}

.div-button {
  justify-content: center;
  display: flex;
  flex-direction: column;
}

.create-button {
  margin: 22px 0 0 0;
  width: 20vw;
  text-align: center;
}

.table-container {
  overflow-x: auto;
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  font-size: 14px;
  text-align: left;
}

thead th {
  padding: 12px;
  font-weight: bold;
}

tbody td {
  padding: 10px;
}

.tableLight tr:nth-child(even) {
  background-color: #f9f9f9;
}

.tableDark tr:nth-child(even) {
  background-color: #3c3c3c;
}



.tableLight {
  background-color: #ffffff;
  color: #333;
}

.tableLight thead th {
  background-color: #f4f4f4;
  color: #555;
  border-bottom: 2px solid #ddd;
}


.tableDark {
  background-color: #2c2c2c;
  color: #eaeaea;
}

.tableDark thead th {
  background-color: #3c3c3c;
  color: #ddd;
  border-bottom: 2px solid #555;
}


.nameLight,
.usernameLight {
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
}

.nameDark,
.usernameDark {
  background-color: #444;
  color: #eee;
  border: 1px solid #666;
  border-radius: 4px;
  padding: 5px;
}


.sidebar-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sidebar-button:hover {
  background-color: #0056b3;
}


.sidebar-button:last-child {
  background-color: #dc3545;
}

.sidebar-button:last-child:hover {
  background-color: #a71d2a;
}


input:focus,
select:focus {
  outline: none;
  border-color: #6f00ff;
  box-shadow: 0 0 3px rgba(145, 16, 226, 0.636);
}

ur {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 250px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}


ur li {
  margin: 0;
  padding: 0;
}


.button-page {
  display: flex;
  align-items: center;
  padding: 15px 0;
  text-decoration: none;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
}


.button-page .fa-icon {
  margin-right: 10px;
}


.button-page:hover {
  background-color: #4007961d;
  color: #5c38ff;
}

.button-page-dark:hover {
  color: white
}
.forms-search{
  display: flex;
  flex-direction: column;
}

.icone-button-close {
  margin-right: 10px;
}



.options-sidebar {
  margin: 20px 0 0 0;
}
.function{
  display: flex;
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

.input-dark {
  color: white;
  background-color: #383838;
  border: none
}
.title-pages{
  font-weight: bold;
  color: purple
}
</style>
