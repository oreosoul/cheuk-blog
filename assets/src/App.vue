<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  font-family: 'Microsoft Yahei', Verdana, Arial;
  color: #2a2a2a;
  margin: 0;
  padding: 0;
}
html {
  background: #f4f4f4;
  font-size: 12px;
  height: 100%;
}
body {
  background: #f4f4f4;
  height: 100%;
}
#app {
  background: inherit;
  height: 100%;
}
ul {
  list-style: none;
}
a {
  text-decoration: none
}
</style>
