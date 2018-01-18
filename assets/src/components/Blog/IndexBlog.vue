<template>
<div>
  <h1>Blog</h1>
  <section class="list-container">
    <ul>
      <li v-for="article in articleList" :key="article.id" :class="['article-item', {'have-img': article.image}]" >
        <div class="content">
          <a href="" class="title">{{article.title}}</a>
          <p>{{article.post}}</p>
          <div class="wrap-tags">
            <span class="time">时间：{{article.time}}</span>
            <span class="tags">标签：
              <a href="" v-for="tag in article.tags" :key="tag">{{tag}}</a>
            </span>
          </div>
        </div>
        <a v-if="article.image" href="" class="wrap-img">
          <img :alt="article.image.alt" :src="article.image.src"/>
        </a>
      </li>
    </ul>
  </section>
</div>
</template>
<script>
import Api from '../../api/API'
const API = new Api()
export default {
  name: 'Blog',
  data () {
    return {
      articleList: []
    }
  },
  mounted () {
    API.getPostList().then(response => {
      if (response.data.code === 200) {
        let parser = new DOMParser()
        response.data.data.articleList.forEach(function (item) {
          console.log(item)
          item.post = parser.parseFromString(item.post, 'text/xml').firstChild.innerHTML
          item.image = item.image === null ? null : {
            alt: parser.parseFromString(item.image, 'text/xml').firstChild.attributes.alt.value,
            src: parser.parseFromString(item.image, 'text/xml').firstChild.attributes.src.value
          }
        })
        this.articleList = response.data.data.articleList
      } else {
        console.error(response.data.data.msg)
      }
      console.log(response)
    }).catch(err => {
      console.error(err)
    })
  },
  components: {
    test: require('../Common/AppMenu')
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
h1 {
  margin-bottom: 17px;
  padding-bottom: 17px;
  border-bottom: 1px solid #dddddd;
}
a:hover {
  text-decoration: underline;
}
.article-item {
  position: relative;
  margin-bottom: 17px;
  padding-bottom: 17px;
  padding-right: 2px;
  border-bottom: 1px solid #dddddd;
  &.have-img {
    padding-right: 170px;
    min-height: 140px;
  }
  .title {
    display: block;
    font-size: 1.45rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  p {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    line-height: 1.9rem;
  }
  .wrap-img {
    display: block;
    position: absolute;
    top: 50%;
    right: 0;
    margin-top: -65px;
    width: 150px;
    height: 120px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
  }
  .wrap-tags {
    font-size: 1rem;
    span{
      margin-right: 10px;
    }
  }
}
</style>
