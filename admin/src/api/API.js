import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'
class Api {
  adminLogin (username, password) {
    return axios.post('/Admin/login', {
      username,
      password
    })
  }
}

export default Api
