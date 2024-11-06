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
    
}