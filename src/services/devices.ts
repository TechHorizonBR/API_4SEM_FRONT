import axios from "axios";

class DevicesService {
  async getDevices(): Promise<Device[]> {
    try {
      const response: axios<Device[]> = await axios.get(
        "http://localhost:8080/api/filters/user-device",
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar os dispositivos:", error);
      throw error;
    }
  }
}

export default new DevicesService();
