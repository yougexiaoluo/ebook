<template>
  <div class="home">
    <div id="read">
      <div class="icon-add"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const getters = {
        a: () => 1,
        b: () => 2
      }
function fn (keys) {
      let data = {}
      keys.forEach(key => {
        if (!data.hasOwnProperty(key)) {
          data[key] = getters[key]
        }
      })
      return data
    }
export default {
  data() {
    return {
      
    }
  },
  computed: {
    ...mapGetters(['getTest']),
    ...fn(['a','b'])
  },
  created() {
    this.$store.dispatch('setTest', 10).then(() => {
      console.log(this.getTest)
    })
    console.log(this.a,this.b)
  },
  methods: {
    
  }
}
</script>
