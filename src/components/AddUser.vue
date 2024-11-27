<template>
  <div class="container">
    <div class="box" :class="{ 'containerDark': isDark, 'containerLight': !isDark }">
      <h1 class="title">User System Manager</h1>
      <div class="block0">
        <div class="block1" :class="{ 'block1Dark': isDark, 'block1Light': !isDark }">
          <a class="sidebar-button" @click="toogleIsVisibleFindUser">+ Find By Username</a>
          <a class="sidebar-button" @click="toogleIsVisibleCreateUser">+ Create User</a>
          <a class="sidebar-button" @click="toogleIsVisibleAllUsers">+ See all users</a>
        </div>

        <div class="block2">
          <!-- Tabela de Usuários -->
          <div class="table-container">
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
                <tr v-for="(usuario, index) in usuarios" :key="usuario.id">
                  <td>
                    <input 
                      v-if="usuario.isEditing" 
                      v-model="usuario.username" 
                      :class="{ 'usernameDark': isDark, 'usernameLight': !isDark }"
                    />
                    <span v-else>{{ usuario.username }}</span>
                  </td>
                  <td>
                    <input 
                      v-if="usuario.isEditing" 
                      v-model="usuario.password" 
                      :class="{ 'usernameDark': isDark, 'usernameLight': !isDark }" 
                      type="password"
                    />
                    <span v-else>{{ usuario.password }}</span>
                  </td>
                  <td>
                    <select 
                      v-if="usuario.isEditing" 
                      v-model="usuario.role" 
                      :class="{ 'usernameDark': isDark, 'usernameLight': !isDark }">
                      <option disabled selected>Select one role</option>
                      <option>Admin</option>
                      <option>User</option>
                    </select>
                    <span v-else>{{ usuario.role }}</span>
                  </td>
                  <td>{{ usuario.createdAt }}</td>
                  <td>{{ usuario.modifiedAt }}</td>
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
import { ref, onMounted } from 'vue';
import registros from '@/services/registros';
import apiClient from '@/services/axiosConfig';

const props = defineProps<{
  isDark: boolean
}>();

const isVisibleFindByUser = ref<boolean>(false);
const isVisibleCreateUser = ref<boolean>(false);
const usuarios = ref<any[]>([]);

const toogleIsVisibleCreateUser = () => {
  isVisibleFindByUser.value = false;
  isVisibleCreateUser.value = true;
};

const toogleIsVisibleFindUser = () => {
  isVisibleCreateUser.value = false;
  isVisibleFindByUser.value = true;
};

const toogleIsVisibleAllUsers = () => {
  isVisibleCreateUser.value = false;
  isVisibleFindByUser.value = false;
};

// Carregar todos os usuários
const getAllUsers = async () => {
  try {
    const todosUsuarios = await registros.getAllUsers();
    usuarios.value = todosUsuarios.map((usuario: any) => ({
      ...usuario,
      isEditing: false,  // Adicionando isEditing a todos os usuários ao carregar
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
    const response = await apiClient.put(`/usuarios/${usuario.id}`, {
      username: usuario.username,
      password: usuario.password,
      role: usuario.role,
    });

    if (response.status === 200) {
      usuario.isEditing = false; // Desativar modo de edição
      alert('Usuário editado com sucesso');
    } else {
      alert('Erro ao editar o usuário');
    }
  } catch (error) {
    console.error("Erro ao editar o usuário:", error);
    alert('Erro ao tentar editar o usuário');
  }
};

const removeUser = async (usuario: any) => {
  try {
    const response = await apiClient.delete(`/usuarios/${usuario.id}`);
    if (response.status === 204) {
      usuarios.value = usuarios.value.filter(u => u.id !== usuario.id);
      alert('Usuário removido com sucesso');
    }
  } catch (error) {
    console.error("Erro ao remover o usuário:", error);
    alert('Erro ao tentar remover o usuário');
  }
};

onMounted(() => {
  getAllUsers();
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
  height: 72%;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  top: 28px;
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
  flex: 1 1 250px; /* Tornando o bloco dos botões flexível, com largura mínima de 250px */
  padding-right: 20px; /* Espaço entre os botões e a tabela */
}

.block2 {
  flex: 3; /* O bloco da tabela ocupa o restante do espaço */
}

.table-container {
  width: 90%;
  max-height: 300px; /* Altura máxima para a tabela */
  overflow: auto; /* Permite rolagem quando o conteúdo ultrapassar o tamanho */
  border-radius: 10px;
  margin-top: 20px; /* Espaçamento acima da tabela */
}

.fline1, .fline2 {
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

.sidebar-button:hover {
  background-color: #5c0ea3;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid rgba(0, 0, 0, 0.265);
}

label{
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



