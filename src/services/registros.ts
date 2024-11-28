import apiClient from '@/services/axiosConfig';
import { useRouter } from 'vue-router';

class RegistrosService {

  // Métodos não implementados
  removeUser(id: any) {
    throw new Error('Method not implemented.');
  }

  editUser(id: any, arg1: { username: string; }) {
    throw new Error('Method not implemented.');
  }

  // Método para obter registros com parâmetros
  async getRegistros(
    id: number,
    page: number,
    dataInicio: string,
    dataFim: string,
  ) {
    try {
      const response = await apiClient.get(
        `/registros/filtros/${dataInicio}/${dataFim}/${id}/${page}`,
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {  // Corrigido para acessar o status correto
        alert("Session expired! Please log in again.");
        const router = useRouter();  // Routers devem ser usados dentro do contexto de componentes Vue
        router.push({ path: '/' });
      }
      console.error("Error fetching registros:", error);
    }
  }

  // Método para buscar usuário por nome
  async getUserByName(name: string) {
    try {
      const response = await apiClient.get(
        `/usersys/username?username=${name}`,
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {  // Corrigido para acessar o status correto
        alert("Session expired! Please log in again.");
        const router = useRouter();  // Routers devem ser usados dentro do contexto de componentes Vue
        router.push({ path: '/' });
      }
      console.log("Error to find user:", error);
    }
  }

  // Método para obter todos os usuários
  async getAllUserSys() {
    try {
      const response = await apiClient.get('/usersys');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {  // Corrigido para acessar o status correto
        alert("Session expired! Please log in again.");
        const router = useRouter();  // Routers devem ser usados dentro do contexto de componentes Vue
        router.push({ path: '/' });
      }
      console.log("Error to find users:", error);
    }
  }

  // Método para atualizar usuários
async updateUserSys(id: number, userData: object) {
  try {
    // Fazendo a requisição PUT para atualizar os dados do usuário
    const response = await apiClient.put(`/usersys/update-user`, userData);

    // Retorna os dados atualizados
    return response.data;
  } catch (error: any) {
    // Verifica se a sessão expirou e faz o tratamento adequado
    if (error.response?.status === 401) {
      alert("Session expired! Please log in again.");
      const router = useRouter();  // O Vue Router deve ser usado para navegação
      router.push({ path: '/' });
    }
    // Exibe no console o erro caso a atualização falhe
    console.log("Error to update user:", error);
  }
}

// Método para deletar usuários (corrigido o erro na URL)
async deleteUserSys(id: number) {  // Corrigido o nome do método e a URL
  try {
    const response = await apiClient.delete(`/usersys/${id}`);  // Corrigido para incluir o id
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {  // Corrigido para acessar o status correto
      alert("Session expired! Please log in again.");
      const router = useRouter();  // Routers devem ser usados dentro do contexto de componentes Vue
      router.push({ path: '/' });
    }
    console.log("Error to delete user:", error);
  }
}

  // Método para deletar usuários (corrigido o erro na URL)
  async deleteUser(id: number) {  // Corrigido o nome do método e a URL
    try {
      const response = await apiClient.delete(`/usuarios/${id}`);  // Corrigido para incluir o id
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {  // Corrigido para acessar o status correto
        alert("Session expired! Please log in again.");
        const router = useRouter();  // Routers devem ser usados dentro do contexto de componentes Vue
        router.push({ path: '/' });
      }
      console.log("Error to delete user:", error);
    }
  }


}

export default new RegistrosService();
