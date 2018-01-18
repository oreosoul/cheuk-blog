import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'
class Api {
  getPostList (limit, page) {
    return axios.post('/', {
      limit,
      page
    })
  }
}

export default Api
