import axios from "axios";

class RegistrosService {
  async getRegistros(id: number) {
    try {
      const response = await axios.get(
        `http://localhost:8080/registros/filtros/2023-01-01/2024-12-31/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar os registros:", error);
      throw error;
    }
  }
}

export default new RegistrosService();
