import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'
class Api {
  getPostList (limit, page) {
    return axios.post('/Post/getPostList', {
      limit,
      page
    })
  }
  getArticleById (_id) {
    return axios.get('/Post/getPostById', {
      params: {
        _id
      }
    })
  }
}

export default Api
