import axios from "axios";

class Demarcacoes{
    async deleteById(id : number){
        try{
            const response = await axios.delete(`http://localhost:8080/demarcacoes/${id}`);

            if(response.status == 204){
                return "Demarcation has been deleted";
            }else{
                return "Error";
            }
        }catch(error){
            return "Error";
        }
    }

    async create(data: {nome: string, usuarioId: number, coordinates:[]}){
        try {
            const response = await axios.post("http://localhost:8080/demarcacoes", data);
            if (response.status === 201) {
              return "Demarcation has been created.";
            } else {
              return "Unable to create a new demarcation.";
            }
        } catch (error) {
            return "Error";
        }
    }

    async getDemarcacoesByUsuario(usuarioId: number){
    try {
      const response = await axios.get(`http://localhost:8080/demarcacoes/user/${usuarioId}`);
      if(response.status == 200){
        return response.data;
      }else{
        return "Error";
      }
    } catch (error) {
      return "Error";
    }
    }
}
export default new Demarcacoes();