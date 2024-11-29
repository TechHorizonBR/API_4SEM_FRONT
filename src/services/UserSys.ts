import apiClient from '@/services/axiosConfig';
import { useRouter } from 'vue-router';

class UserSysService{
    async updateUser(userData: { id: number ,name: string; role: string }) {
        const router = useRouter();
        try {
          const response = await apiClient.patch('/usersys/update-user',userData);
          console.log(response);
          return response.data;
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            alert("Session expired! Please log in again.");
            router.push({ path: '/' });
          } else {
            console.error("Error updating user:", error);
            alert('Error updating user');
          }
        }
      }

      async createUser(userData: { username: string; password: string; role: string }) {
        const router = useRouter();
        try {
          const response = await apiClient.post('/usersys/create', userData);
          return response.data;
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            alert("Unauthorized! Please check your credentials.");
            router.push({ path: '/' });
          } else {
            console.error("Error creating user:", error);
            alert('Failed to create user. Please try again.');
          }
        }
    }

        async removeUser(username: string) {
            const router = useRouter();
            try {
              const response = await apiClient.delete(`/usersys/delete/${username}`);
              return response.data; // Retorna a resposta do servidor
            } catch (error: any) {
              if (error.response && error.response.status === 401) {
                alert("Unauthorized! Please log in again.");
                router.push({ path: '/' }); // Redireciona o usuário para a página de login
              }
              console.error("Error deleting user:", error);
              throw error; // Lança o erro para ser tratado no componente
        }
    }
}


export default new UserSysService();