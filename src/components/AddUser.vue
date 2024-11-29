<template>
  <div class="container">
    <div class="box" :class="{ 'containerDark': isDark, 'containerLight': !isDark }">
      <h1 class="title">User System Manager</h1>
      <div class="block0">
        <div class="block1" :class="{ 'block1Dark': isDark, 'block1Light': !isDark }">
          <a class="sidebar-button" @click="toggleIsVisibleFindUser">+ Find By Username</a>
          <a class="sidebar-button" @click="toggleIsVisibleCreateUser">+ Create User</a>
          <a class="sidebar-button" @click="toggleIsVisibleAllUsers">+ See all users</a>
        </div>

        <div class="block2">
          <!-- Tabela de Usuários -->
          <div class="table-container">
            <table :class="{ 'tableDark': isDark, 'tableLight': !isDark }">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>CreatedAt</th>
                  <th>ModifiedAt</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(usuario, index) in usuarios" :key="usuario.id">
                  <td>{{ usuario.username }}</td>

                  <!-- Campo para edição do Nome -->
                  <td>
                    <input 
                      v-if="usuario.isEditing" 
                      v-model="usuario.name" 
                      :class="{ 'nameDark': isDark, 'nameLight': !isDark }"
                    />
                    <span v-else>{{ usuario.name }}</span>
                  </td>

                  <!-- Campo para edição do Cargo -->
                  <td>
                    <select 
                      v-if="usuario.isEditing" 
                      v-model="usuario.role" 
                      :class="{ 'roleDark': isDark, 'roleLight': !isDark }"
                    >
                      <option value="Admin">Admin</option>
                      <option value="ROLE_USER">User</option>
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

const getAllUsersSys = async () => {
  try {
    const todosUsuarios = await registros.getAllUserSys();
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
    // Envia os dados atualizados do usuário para a API
    const response = await apiClient.put(`/usersys/update-user/${usuario.id}`, {
      name: usuario.name,
      role: usuario.role,
    });

    if (response.status === 200 || response.status === 204) {
      usuario.isEditing = false; // Desativa o modo de edição
      alert('Usuário editado com sucesso');
      getAllUsersSys(); // Recarrega a lista de usuários
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
    const response = await apiClient.delete(`/usersys`);
    if (response.status === 204) {
      usuarios.value = usuarios.value.filter(u => u.id !== usuario.id); // Remove o usuário da lista local
      alert('Usuário removido com sucesso');
    } else {
      alert('Erro ao tentar remover o usuário');
    }
  } catch (error) {
    console.error("Erro ao remover o usuário:", error);
    alert('Erro ao tentar remover o usuário');
  }
};

onMounted(() => {
  getAllUsersSys();
});
</script>

<style scoped>

.nameDark{
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
  width: 80%;
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


<<<<<<< HEAD

=======
>>>>>>> 21d4f84871ea430e7a06cc6a65f84f7ced7d860c
