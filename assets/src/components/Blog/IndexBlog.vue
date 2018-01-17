<template>
<div>
  <h1>Blog</h1>
  <section class="list-container">
    <ul>
      <li class="article-item">
        <div class="content">
          <a href="" class="title">2017 | 这一年，我按了两万次快门</a>
          <p>2017年已经接近尾声，心血来潮想给自己做一个2017年总结，这一年，我有四段难忘的旅行经历；这一年，我在学校办了两个摄影展；这一年，我拍了两万张照片~ 为了做这个旅行摄影总...</p>
          <div class="wrap-tags">
            <span class="time">时间：2018/1/17</span>
            <span class="tags">标签：
              <a href="">测试1</a>
              <a href="">测试2</a>
              <a href="">测试3</a>
            </span>
          </div>
        </div>
      </li>
      <li class="article-item have-img">
        <div class="content">
          <a href="" class="title">2017 | 这一年，我按了两万次快门</a>
          <p>2017年已经接近尾声，心血来潮想给自己做一个2017年总结，这一年，我有四段难忘的旅行经历；这一年，我在学校办了两个摄影展；这一年，我拍了两万张照片~ 为了做这个旅行摄影总...</p>
          <div class="wrap-tags">
            <span class="time">时间：2018/1/17</span>
            <span class="tags">标签：
              <a href="">测试1</a>
              <a href="">测试2</a>
              <a href="">测试3</a>
            </span>
          </div>
        </div>
        <a href="" class="wrap-img">
          <img src="../../assets/img/article-img.jpg"/>
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
    API.getTenPost().then(response => {
      console.log('success')
    }).catch(err => {
      console.error(err)
    })
  },
  components: {
    test: require('../Common/AppMenu')
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
