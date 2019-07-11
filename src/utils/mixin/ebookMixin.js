// 此文件用于存放相同的代码
import { mapGetters } from 'vuex'

const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible'
    ])
  }
}

export { ebookMixin }
