import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Common from '@/components/Common/Common'
import Blog from '@/components/Blog/IndexBlog'
import Gallery from '@/components/Gallery/IndexGallery'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Common',
    component: Common,
    redirect: '/home',
    children: [{
      path: 'gallery',
      name: 'Gallery',
      component: Gallery
    }, {
      path: 'blog',
      name: 'Blog',
      component: Blog
    }]
  }, {
    path: '/home',
    name: 'Home',
    component: Home
  }]
})
