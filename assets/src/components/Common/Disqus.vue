<template>
<div id="disqus_thread"></div>
</template>
<script>
/* eslint-disable */
export default {
  name: 'Disqus',
  data () {
    return {
    }
  },
  mounted () {
    this.initDisqus()
  },
  methods: {
    initDisqus () {
      // DON'T EDIT BELOW THIS LINE
      var d = document;
      var s = d.createElement('script');
      s.src = 'https://ping-an-xi-le-chang-ru-suo-yuan.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    }
  }
}
</script>
<style lang="css" scoped>
</style>
