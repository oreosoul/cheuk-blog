
<template>
<div :class="['menu-container', isShowMenu ? 'show' : 'hide']" @click="isShowMenu=!isShowMenu">
  <div class="avator-container">
    <span class="avator">
      <img alt="avator" src=""/>
    </span>
    <span class="name">Cheuk</span>
  </div>
  <ul>
      <li><router-link to="/">HOME</router-link></li>
      <li><router-link to="/blog">BLOG</router-link></li>
      <li><router-link to="/gallery">GALLERY</router-link></li>
  </ul>
</div>
</template>
<script>
export default {
  name: 'Menu',
  data () {
    return {
      isShowMenu: true
    }
  }
}
</script>
<style lang="scss" scoped>
.menu-container {
  overflow-y: auto;
  min-width: 300px;
  width:300px;
  border-right: 1px solid #dddddd;
  transition: .7s ease;
  background: inherit;
  &.hide {
    margin-left: -260px;
    box-shadow: none;
  }
  &.show {
    margin-left: 0;
    box-shadow: -10px 0px 40px #4d4d4d;
  }
  ul {
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 1.6rem;
    li {
      margin-bottom: 10px;
    }
  }
}
.avator-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 50%;
  .avator {
    display: block;
    height: 100px;
    width: 100px;
    margin-bottom: 10px;
    border-radius: 50%;
    background-color: #2a2a2a;
    img{
      display: block;
      height: 100px;
      width: 100px;
    }
  }
  .name {
    margin-bottom: 20px;
    font-size: 2.45rem;
  }
}
</style>
