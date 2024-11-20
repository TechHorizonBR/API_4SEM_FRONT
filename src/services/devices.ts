import apiClient from '@/services/axiosConfig';
import { useRouter } from 'vue-router';

class DevicesService {
  async getDevices() {
    const router = useRouter();
    try {
      const response = await apiClient.get(
        "/api/filters/user-device",
      );

      if (response.status == 401) {
        router.push({ path: "/" });
      }
      return response.data;
    } catch (error: any) {
      if (error.status === 401) {
        router.push({ path: '/' });
      }

    }
  }
}

export default new DevicesService();
