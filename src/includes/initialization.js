import { useCommonStore } from '@/stores/common'


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

function initialization(vm, setLanguageDone) {
  internationalization(vm, setLanguageDone)
  handleMediaQueryChange()
}

export default initialization