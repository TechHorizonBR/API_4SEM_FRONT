import Axios from 'axios';

class FilterService{
  postFilter() {
    return Axios.post('http://localhost:8080/', {   //O Endpoint vai nessa linha
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filterData),
    })
  }
}

export default new FilterService();