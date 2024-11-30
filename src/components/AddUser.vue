<template>
  <div class="container">
    <div class="box" :class="{ 'containerDark': isDark, 'containerLight': !isDark }">
      <h1 class="title">User System Manager</h1>
      <div class="block0">
        <div class="block1" :class="{ 'block1Dark': isDark, 'block1Light': !isDark }">
          <a class="sidebar-button" @click="toggleIsVisibleFindUser">+ Find By Username</a>
          <a class="sidebar-button" @click="toggleIsVisibleCreateUser">+ Create User</a>
          <a class="sidebar-button" @click="toggleIsVisibleAllUsers">+ See all users</a>
          <a class="sidebar-button" @click="closeAddUser"  id="bClose"> Close</a>
        </div>

        <div class="block2">
          <div class="blockForm" v-if="isVisibleCreateUser">
            <div class="fline1">
              <div class="case1">
                <label for="name">Username:</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Type the username"
                  v-model="usuario.username"
                  @input="usuario.name = usuario.username"
                />
              </div>
              <div class="case2">
                <label for="role">Role:</label>
                <select id="role" v-model="usuario.role">
                  <option disabled selected>Select One Role</option>
                  <option value="ROLE_ADMIN">Admin</option>
                  <option value="ROLE_CLIENTE">User</option>
                </select>
              </div>
            </div>

            <div class="fline2">
              <div class="case3">
                <label for="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Type the password"
                  v-model="usuario.password"
                />
              </div>
              <div class="case3">
                <label for="confirm-password">Confirm the Password:</label>
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm the password"
                  v-model="confirmPassword"
                />
              </div>
            </div>
            <a class="create-button" @click="createUser">Cadastrar</a>
          </div>
          <!-- Tabela de Usuários -->
          <div class="table-container">
            <table :class="{ 'tableDark': isDark, 'tableLight': !isDark }">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(usuario, index) in usuarios" :key="usuario.id">
                  <td>
                    <input 
                      v-if="usuario.isEditing" 
                      v-model="usuario.name" 
                      :class="{ 'usernameDark': isDark, 'usernameLight': !isDark }"
                    />
                    <span v-else>{{ usuario.name }}</span>
                  </td>
                  <td>
                    <select 
                      v-if="usuario.isEditing" 
                      v-model="usuario.role" 
                      :class="{ 'usernameDark': isDark, 'usernameLight': !isDark }">
                      <option disabled selected>Select one role</option>
                      <option value="ROLE_ADMIN">Admin</option>
                      <option value="ROLE_CLIENTE">User</option>
                    </select>
                    <span v-else>{{ usuario.role }}</span>
                  </td>
                  <td>
                    <button 
                      v-if="usuario.isEditing" 
                      @click="saveUser(usuario)" 
                      class="sidebar-button">Save</button>
                    <button 
                      v-else 
                      @click="editUser(usuario)" 
                      class="sidebar-button">Edit</button>
                    <button 
                      @click="removeUser(usuario)" 
                      class="sidebar-button">Remove</button>
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
<script setup lang="ts">
import { ref, onMounted } from "vue";
import registros from "@/services/registros";
import UserSysService from "@/services/UserSys";
import apiClient from "@/services/axiosConfig";
import { userStore } from "@/stores/token";
import { off } from "process";

const isVisibleFindByUser = ref<boolean>(false);
const isVisibleCreateUser = ref<boolean>(false);
const usuarios = ref<any[]>([]);

const usuario = ref({
  name: '',
  username:'',
  password: '',
  role: ''
});

const confirmPassword = ref('');

const toggleIsVisibleCreateUser = () => {
  isVisibleFindByUser.value = false;
  isVisibleCreateUser.value = true;
};

const toggleIsVisibleFindUser = () => {
  isVisibleCreateUser.value = false;
  isVisibleFindByUser.value = true;
};

const toggleIsVisibleAllUsers = () => {
  isVisibleCreateUser.value = false;
  isVisibleFindByUser.value = false;
};

const closeAddUser = () => {
  // Função para fechar a adição de usuário
};
const userId = userStore().user.id;

const userUpdateData = {
  id: userId,
};


const createUser = async () => {
  if (usuario.value.password !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  if (
    !usuario.value.name ||
    !usuario.value.password ||
    !usuario.value.role
  ) {
    alert("All fields are required!");
    return;
  }

  try {
    const response = await UserSysService.createUser(usuario.value);

    if (response) {
      alert("User created successfully!");
      resetForm(); // Reseta o formulário após sucesso
      getAllUsersSys();
    }
  } catch (error) {
    console.error("Error creating user:", error);
    // O tratamento de erro já é feito no serviço
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
        role: usuario.role,
      };
      
      const updatedUser = await UserSysService.updateUser(userData);

    if (updatedUser) {
      usuario.isEditing = false; // Desativa o modo de edição
      alert("Usuário editado com sucesso");
      getAllUsersSys(); // Recarrega os usuários após atualização
    }
  } catch (error) {
    console.error("Erro ao editar o usuário:", error);
    alert("Erro ao tentar editar o usuário");
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
    alert(`User "${usuario.username}" removed successfully!`);
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Erro ao tentar remover o usuário");
  }
};

const resetForm = () => {
  usuario.value.username = '';
  usuario.value.password = '';
  usuario.value.role = '';
  confirmPassword.value = '';
};

onMounted(() => {
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

.box {
  display: flex; /* Usando flexbox para dividir em colunas */
  width: 75%;
  height: 52%;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  top: 28px;
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
  background-color: #5c0ea3;
}

.containerLight {
  background-color: #fff;
}

.block0 {
  display: flex;
  width: 100%;
}

.block1 {
  flex: 1 1 250px 500px; /* Tornando o bloco dos botões flexível, com largura mínima de 250px */
  padding-right: 20px;
  margin-right: 50px; /* Espaço entre os botões e a tabela */
}

.block2 {
  flex: 3; /* O bloco da tabela ocupa o restante do espaço */
  flex: 1 1 250px 500px;
}

.table-container {
  width: 90%;
  max-height: 300px; /* Altura máxima para a tabela */
  overflow: auto; /* Permite rolagem quando o conteúdo ultrapassar o tamanho */
  border-radius: 10px;
  margin-top: 20px; /* Espaçamento acima da tabela */
  margin-left: 30px;
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

.blockForm {
  margin-bottom: 15px;
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
}

.create-button {
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
}

.sidebar-button:hover {
  background-color: #5c0ea3;
}

table {
  width: 80%;
  border-collapse: collapse;
  border: 1px solid rgba(0, 0, 0, 0.265);
}

label {
  margin-bottom: 5px;
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

input,
select {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid rgb(156, 156, 156);
}

/* Estilos específicos para o botão "Editar" */
.edit-button {
  width: auto; /* Ajusta automaticamente o tamanho do botão */
  padding: 6px 12px; /* Ajuste do padding (menor que o padrão) */
  font-size: 12px; /* Ajuste do tamanho da fonte */
  background-color: #5c0ea3; /* Cor de fundo diferente */
}

.edit-button:hover {
  background-color: #5c0ea3; /* Cor de hover diferente */
}
</style>
