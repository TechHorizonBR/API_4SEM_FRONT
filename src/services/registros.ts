import apiClient from "@/services/axiosConfig";
import { useRouter } from "vue-router";

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
    const router = useRouter();
    try {
      const response = await apiClient.get(
        `/registros/filtros/${dataInicio}/${dataFim}/${id}/${page}`,
      );
      return response.data;
    } catch (error: any) {
      if (error.status === 401) {
        alert("Your session has expired. Please log in again.");
        router.push({ path: "/" });
      }
    }
  }

  async getUserByName(name: string) {
    const router = useRouter();
    try {
      const response = await apiClient.get(
        `/usersys/username?username=${name}`,
      );
      return response.data;
    } catch (error: any) {
      if (error.status === 401) {
        alert("Your session has expired. Please log in again.");
        router.push({ path: "/" });
      }
      console.log("Error to find user:", error);
    }
  }

  async getAllUsers() {
    const router = useRouter();
    try {
      const response = await apiClient.get("/usersys");
      return response.data;
    } catch (error: any) {
      if (error.status === 401) {
        alert("Your session has expired. Please log in again.");
        router.push({ path: "/" });
      }
      console.log("Error to find users:", error);
    }
  }

  async resetPassword(data: { id: number; password: string; passwordConfirmation: string }) {
    const router = useRouter();
    try {
      const response = await apiClient.put(`/usersys/reset-senha/${data.id}`, {
        id: data.id,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      });
      if (response.status === 200) {
        return {
          status: true,
          message: "Password changed successfully!"
        };
      } else if (response.status == 401) {
        alert("Session expired! Please log in again.");
        const router = useRouter();
        router.push({ path: "/" });
      } else {
        return {
          status: false,
          message: "Unable to reset password."
        };
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        alert("Session expired! Please log in again.");
        router.push({ path: "/" });
      } else {
        console.error("An unexpected error occurred:", error);
        return "An unexpected error occurred while resetting the password.";
      }
    }
  }

}

export default new RegistrosService();
