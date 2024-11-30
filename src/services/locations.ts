import axios from "axios";

class LocatiosAPIOpenCageData {
  async getAddressByCoordenadas(latitude: number, longitude: number) {
    try {
      const KEY_API = "df75ee7b8df149b292e1f66afe34baa4";

      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${KEY_API}`,
      );

      if (response.data && response.data.results && response.data.results[0]) {
        return response.data.results[0].components;
      } else {
        throw new Error(
          "Nenhum resultado encontrado para as coordenadas fornecidas.",
        );
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      throw error;
    }
  }
}

export default new LocatiosAPIOpenCageData();
