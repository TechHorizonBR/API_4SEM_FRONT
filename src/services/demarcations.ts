import axios from "axios";

class Demarcacoes{
    async deleteById(id : number){
        try{
            const response = await axios.delete(`http://localhost:8080/demarcacoes/${id}`);

            if(response.status == 204){
                return "User has been deleted";
            }else{
                return "Error";
            }
        }catch(error){
            return "Error";
        }
    }

    async create(data: {nome: string, usuarioId: {id:number}, coordinates:[]}){
        try {
            const response = await axios.post("http://localhost:8080/demarcacoes", data);
            if (response.status === 201) {
              return "Demacation has been created";
            } else {
              return "Error";
            }
        } catch (error) {
            return "Error";
        }
    }

    async getDemarcacoesByUsuario(usuarioId: number){
    try {
      const response = await axios.get(`http://localhost:8080/demarcacoes/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      return "Error";
    }
  }

    
}