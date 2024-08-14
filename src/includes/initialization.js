import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { firebase, favoriteSongListCollection } from '@/includes/firebase'

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

function handleMediaQueryChange() {
  const { setMoblieScreen, isMoblieScreen } = useCommonStore()
  const mediaQuery = window.matchMedia('(max-width: 768px)')
  mediaQuery.addEventListener('change', function (event) {
    setMoblieScreen(event.matches)
    console.log('isMoblieScreen_1 => ', isMoblieScreen)
  })
}

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

function initialization(vm, setLanguageDone) {
  internationalization(vm, setLanguageDone)
  handleMediaQueryChange()
  getFavSongList()
}

export default initialization