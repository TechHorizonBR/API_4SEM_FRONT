import axios from "axios";

class RegistrosService {
  async getRegistros(
    id: number,
    page: number,
    dataInicio: string,
    dataFim: string,
  ) {
    try {
      const response = await axios.get(
        `http://localhost:8080/registros/filtros/${dataInicio}/${dataFim}/${id}/${page}`,
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar os registros:", error);
      throw error;
    }
  }
}

export default new RegistrosService();
