import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Blog from '@/components/Blog/IndexBlog'
import Gallery from '@/components/Gallery/IndexGallery'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/blog',
    name: 'Blog',
    component: Blog
  }, {
    path: '/gallery',
    name: 'Gallery',
    component: Gallery
  }]
})
