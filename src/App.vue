<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  created () {
    this.recalc()
  },
  methods: {
    recalc () {
      document.addEventListener('DOMContentLoaded', () => {
        let html = document.querySelector('html')
        let fontSize = window.innerWidth / 10
        fontSize = fontSize > 50 ? 50 : fontSize
        html.style.fontSize = fontSize + 'px'
      })
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
