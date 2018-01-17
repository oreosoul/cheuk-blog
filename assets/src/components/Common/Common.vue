<template>
<div class="common-container">
  <app-menu v-once class="app-menu"></app-menu>
  <router-view class="view-container"/>
</div>
</template>
<script>
export default {
  name: 'Common',
  data () {
    return {
    }
  },
  components: {
    'app-menu': require('./AppMenu')
  }
}
</script>
<style lang="scss" scoped>
.common-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: inherit;
  display: flex;
}
.app-menu {
}
.view-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 4rem 2.5rem;
}
</style>
