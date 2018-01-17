import axios from 'axios'
// import config from './config'
// import qs from 'qs'
axios.defaults.baseURL = 'http://localhost:3000'
class Api {
  getTenPost () {
    return axios.get('/', {})
  }
}

export default Api
