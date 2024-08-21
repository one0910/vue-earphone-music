import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { favoriteSongListCollection } from '@/includes/firebase'
import { ref } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

// 判定網站瀏覽者所在國藉
async function internationalization(vm, setLanguageDone) {
  const { setLanguage } = useCommonStore()

  try {
    const response = await fetch('https://ipapi.co/json/')
    const { country } = await response.json()
    // const country = ''
    switch (country) {
      case 'TW':
      case 'CN':
        vm.$i18n.locale = 'zh'
        setLanguage('zh')
        break;
      default:
        vm.$i18n.locale = 'en'
        setLanguage('en')
        break;
    }
  } catch (error) {
    vm.$i18n.locale = 'en'
    setLanguage('en')
  } finally {
    setLanguageDone(true)
  }

}

// 判定螢幕尺寸
function handleMediaQueryChange() {
  const { setMoblieScreen } = useCommonStore()
  const mediaQuery = window.matchMedia('(max-width: 768px)')
  mediaQuery.addEventListener('change', function (event) {
    setMoblieScreen(event.matches)
  })
}

// 取得歌曲清單
async function getFavSongList(params) {
  const { uid, favSongList } = useUserStore()
  try {
    if (uid) {
      const favSongListSnapshot = await favoriteSongListCollection.doc(uid).get()
      favSongList.push(...favSongListSnapshot.data()['favSongLists'])
    }
  } catch (error) {
    console.log('error => ', error)
  }
}

// 註冊Service Worker，用來做PWA的
function registerSW() {
  /**
   * This function will register a periodic sync check every hour, you can modify the interval as needed.
   * @param {string} swUrl
   * @param {ServiceWorkerRegistration} r
   */

  const period = 0
  const swActivated = ref(false)

  function registerPeriodicSync(swUrl, r) {
    if (period <= 0) return

    setInterval(async () => {
      if ('onLine' in navigator && !navigator.onLine) return

      const resp = await fetch(swUrl, {
        cache: 'no-store',
        headers: {
          cache: 'no-store',
          'cache-control': 'no-cache'
        }
      })

      if (resp?.status === 200) await r.update()
    }, period)
  }

  useRegisterSW({
    immediate: true,
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return
      if (r?.active?.state === 'activated') {
        swActivated.value = true
        registerPeriodicSync(period, swUrl, r)
      } else if (r?.installing) {
        r.installing.addEventListener('statechange', (e) => {
          /** @type {ServiceWorker} */
          const sw = e.target
          swActivated.value = sw.state === 'activated'
          if (swActivated.value) registerPeriodicSync(period, swUrl, r)
        })
      }
    }
  })
}

function initialization(vm, setLanguageDone) {
  internationalization(vm, setLanguageDone)
  handleMediaQueryChange()
  getFavSongList()
  registerSW()
}

export default initialization