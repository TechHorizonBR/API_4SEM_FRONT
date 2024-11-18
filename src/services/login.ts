import axios from "axios";

class LoginService{
  async autenticarUsuario(
    usuario: string,
    senha: string
  ){
    try {
      const response = await axios.post(
        `http://localhost:8080/auth`,
        {
          username: "usuario",
          password: "senha"
        }
      );
      return response.data;
      
    } catch (error) {
      console.error("Falha para autenticar:", error);
      throw error;
    }
  }

}

export default new LoginService();