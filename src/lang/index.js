import Vue from 'vue'
import VueI18N from 'vue-i18n'
import en from './en'
import cn from './cn'
import { getLocale, saveLocale } from '@/utils/localStorage'

Vue.use(VueI18N)

let locale = getLocale()
// 不存在的情况，给予默认值
if (!locale) {
  locale = 'cn'
  saveLocale(locale)
}

const messages = { en, cn }

const i18n = new VueI18N({
  locale,
  messages
})

export default i18n
