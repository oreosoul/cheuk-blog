<template>
  <div>
    <h1></h1>
  </div>
</template>
<script>
import Api from '../../api/API'
const API = new Api()
export default {
  name: 'Article',
  data () {
    return {
      article: {
        _id: '',
        title: '',
        post: '',
        time: null,
        tags: [],
        author: '',
        pv: 0

      }
    }
  },
  mounted () {
    this.getArticleById()
  },
  methods: {
    getArticleById () {
      console.log(this.$route.params._id)
      API.getArticleById(this.$route.params._id).then(response => {
        if (response.data.code === 200) {
          this.article = response.data.data.article
        } else {
          console.error(response.data.data.msg)
        }
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 17px;
  padding-bottom: 17px;
  border-bottom: 1px solid #dddddd;
}
</style>
