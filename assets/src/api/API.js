import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'
class Api {
  getPostList () {
    return axios.get('/', {})
  }
}

export default Api
