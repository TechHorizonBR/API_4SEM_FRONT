import apiClient from "@/services/axiosConfig";
import { useRouter } from "vue-router";

class Demarcacoes {
  async deleteById(id: number) {
    const router = useRouter();
    try {
      const response = await apiClient.delete(`/demarcacoes/${id}`);

      if (response.status == 204) {
        return "Demarcation has been deleted";
      } else if (response.status == 401) {
        alert("Your session has expired. Please log in again.");
        router.push({ path: "/" });
      } else {
        return "Error";
      }
    } catch (error: any) {
      if (error.status === 401) {
        alert("Your session has expired. Please log in again.");
        router.push({ path: "/" });
      }
    }
  }

  async create(data: { nome: string; usuarioId: number; coordinates: [] }) {
    const router = useRouter();
    try {
      const response = await apiClient.post("/demarcacoes", data);
      if (response.status === 201) {
        return "Demarcation has been created.";
      } else if (response.status == 401) {
        alert("Your session has expired. Please log in again.");
        const router = useRouter();
        router.push({ path: "/" });
      } else {
        return "Unable to create a new demarcation.";
      }
    } catch (error: any) {
      if (error.status === 401) {
        alert("Your session has expired. Please log in again.");
        router.push({ path: "/" });
      }
    }
  }

  async getDemarcacoesByUsuario(usuarioId: number) {
    const router = useRouter();
    try {
      const response = await apiClient.get(`/demarcacoes/user/${usuarioId}`);
      if (response.status == 200) {
        return response.data;
      } else if (response.status == 401) {
        const router = useRouter();
        alert("Your session has expired. Please log in again.");
        router.push({ path: "/" });
      } else {
        return "Error";
      }
    } catch (error: any) {
      if (error.status === 401) {
        alert("Your session has expired. Please log in again.");
        router.push({ path: "/" });
      }
    }
  }
}
export default new Demarcacoes();
