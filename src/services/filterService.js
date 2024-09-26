import axios from 'axios';

class FilterService{
  async postFilter(body) {
    try{
      let response = await axios.post('http://localhost:8080/', body);
      if (response.status === 200){
        return response.data;
      } else {
        throw new Error("Houve um erro na requisição");
      }
    } catch (error) {
      throw new Error("Houve um erro na requisição");
    }   
  }
}

export default new FilterService();