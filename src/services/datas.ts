import axios from "axios";

class DateService {
    async getDate(): Promise<Date[]> {
        try {
            const response: axios<Date[]> = await axios.get(
          //"http://localhost:8080/api/filters/",
        );
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar os dispositivos:", error);
            throw error;
        }
    }
}

export default new DateService();