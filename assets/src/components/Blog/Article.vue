<template>
  <div class="side-container">
    <h1>{{article.title}}</h1>
    <div class="wrap-tags">
      <span class="time">时间：{{article.time.minute}}</span>
      <span class="tags">标签：
        <a href="" v-for="tag in article.tags" :key="tag">{{tag}}</a>
      </span>
    </div>
    <section class="article-container" v-html="articleHTML"></section>
    <disqus></disqus>
  </div>
</template>
<script>
import { markdown } from 'markdown'
import Api from '../../api/API'
const API = new Api()
export default {
  name: 'Article',
  components: {
    'disqus': require('../Common/Disqus')
  },
  data () {
    return {
      article: {
        _id: '',
        title: '',
        post: '',
        time: {
          date: null,
          year: '',
          month: '',
          day: '',
          minute: ''
        },
        tags: [],
        author: '',
        pv: 0

      }
    }
  },
  computed: {
    articleHTML () {
      return markdown.toHTML(this.article.post)
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
.article-container {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  line-height: 1.9rem;
}
.wrap-tags {
  margin-bottom: 1rem;
}
</style>
