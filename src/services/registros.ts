import apiClient from '@/services/axiosConfig';
import { useRouter } from 'vue-router';

class RegistrosService {
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
    } catch (error : any) {
      if(error.status === 401){
        alert("Session expired! Please log in again.");
        router.push({path: '/'});
    }
    }
  }
}

export default new RegistrosService();
