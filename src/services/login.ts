import axios from "axios";

class LoginService {
  async autenticarUsuario(usuario: string, senha: string) {
    try {
      const response = await axios.post(
        `http://localhost:8080/auth`,
        {
          username: usuario,
          password: senha,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response;
    } catch (error) {}
  }
}

export default new LoginService();
