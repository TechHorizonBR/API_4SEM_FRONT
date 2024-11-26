<template>
  <div class="container">
    <div class="box" :class="{ 'containerDark': isDark, 'containerLight': !isDark }">
      
      <div class="block0">

        <div class="block1" :class="{ 'block1Dark': isDark, 'block1Light': !isDark }">
            <div class="container-admin">
              <div class="quadrante-admin">
              ADMIN
            </div>
            <h1 class="title">User System Manager</h1>
          </div>
          
          <a class="sidebar-button" @click="toogleIsVisibleCreateUser">+ Create User</a>
          <a class="sidebar-button" @click="toogleIsVisibleAllUsers">+ See all users</a>
          <!-- <button class="sidebar-button" id="bClose">Close</button> -->
        </div>

        


        <div class="block2">

          <div class="blockForm" v-if="isVisibleAllUsers">
          <div class="fline1" :class="{ 'blockDark': isDark, 'blockLight': !isDark }">
            <div class="case1">
              <label for="username">Username:</label>
              <input type="text" id="username" :class="{ 'usernameDark': isDark, 'usernameLight': !isDark }"
                placeholder="Type the username" />
            </div>
          </div>
        </div>
          <div class="blockForm" v-if="isVisibleCreateUser">
            <div class="fline1" :class="{ 'blockDark': isDark, 'blockLight': !isDark }">
              <div class="case1">
                <label for="username">Username:</label>
                <input type="text" id="username" :class="{ 'usernameDark': isDark, 'usernameLight': !isDark }"
                  placeholder="Type the username" />
              </div>
              <div class="case2">
                <label for="role">Role:</label>
                <select :class="{ 'usernameDark': isDark, 'usernameLight': !isDark }" id="role">
                  <option disabled selected>Select one role</option>
                  <!-- Add role options here -->
                </select>
              </div>
            </div>

            <div class="fline2">
              <div class="case3">
                <label for="password">Password:</label>
                <input type="password" id="password" :class="{ 'usernameDark': isDark, 'usernameLight': !isDark }"
                  placeholder="Type the password" />
              </div>
              <div class="case3">
                <label for="confirm-password">Confirm the Password:</label>
                <input type="password" id="confirm-password" :class="{ 'usernameDark': isDark, 'usernameLight': !isDark }"
                  placeholder="Confirm the password" />
              </div>
            </div>
          </div>
          <div class="table-container" v-if="isVisibleAllUsers">
            <table :class="{ 'tableDark': isDark, 'tableLight': !isDark }">
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
                <tr>
                  <td>Exemplo 1</td>
                  <td>Exemplo 2</td>
                  <td>Exemplo 3</td>
                  <td>00.00.00</td>
                  <td>00.00.00</td>
                  <td>Editar/Remover</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';


const props = defineProps<{
  isDark: boolean
}>();


const isVisibleCreateUser = ref<boolean>(false);
const isVisibleAllUsers = ref<boolean>(true);


const toogleIsVisibleCreateUser = () => {
  isVisibleAllUsers.value = false;
  isVisibleCreateUser.value = true;
}


const toogleIsVisibleAllUsers = () => {
  isVisibleCreateUser.value = false;
  isVisibleAllUsers.value = true;
}

</script>

<style scoped>
/* Estilos para centralizar o retângulo */
.container-admin{
  display: flex;
  align-items: center;
  gap: 10px;
}
.quadrante-admin{
  background-color: #5c0ea3;
  color: white;
  padding: 10px;
  border-radius: 3px;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
}
.block1Dark{
  color: white !important;
}
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
  color: white
}

.containerLight {
  background-color: #f7f7f7cd;
}

.fline1,
.fline2 {
  display: grid;
  grid-template-columns: 2fr 2fr;
  gap: 2rem;
  margin-bottom: 2%;
  margin-top: 3%;
}

.usernameDark {
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
  font-size: 1em;
  margin: 0;
}

.block0 {
  display: flex;
  flex-direction: row;
  width: 102%;
  height: 98%;
}

.block1 {
  width: 20%;
}

.block2 {
  display: flex;
  flex-direction: column;
  margin-left: 8%;
  width: 67%;
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

.blockForm {
  margin-bottom: 15px;
}

.tableDark {
  border: 1px solid rgba(211, 210, 210, 0.703);
}

.sidebar-button {
  width: 100%;
  padding: 10px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: block;
  border-radius: 8px;
  cursor: pointer;
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
