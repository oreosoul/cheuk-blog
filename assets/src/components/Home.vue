<template>
<section class="main">
  <div class="titleBox">
    <h1>I`m Cheuk, welcome!</h1>
    <ul>
      <li><router-link to="/blog">Blog</router-link></li>
      <li><router-link to="/gallery">Gallery</router-link></li>
    </ul>
  </div>
</section>
</template>
<script>
export default {
  name: 'home',
  data () {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
$primaryBlack: #2a2a2a;
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  height: 100vh;
  width: 100%;
  background: url('../assets/img/snow-mountain.jpeg');
  background-position: center;
  background-size: cover;
  .titleBox {
    padding: 2rem 4rem;
    margin-top: -10rem;
    background-color: rgba(255, 255, 255, .65)
  }
  h1 {
    text-align: center;
    font-weight: lighter;
    font-size: 4.25rem;
  }
  ul {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
  }
  li {
    padding: .1rem 1rem;
    margin: 0 10px;
    border: 2px solid $primaryBlack;
  }
}
</style>
