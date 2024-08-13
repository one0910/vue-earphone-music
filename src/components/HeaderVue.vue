<script>
import { mapWritableState, mapActions, mapState } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useModalStore } from '@/stores/modal'
import { useCommonStore } from '@/stores/common'
import { auth } from '@/includes/firebase'
import toastMessage from '@/components/Alert/toastMessage.vue'
import languageIcon from '@/assets/images/language-icon.png'

export default {
  data() {
    return {
      hamburgerChange: false,
      menu_hamberger_css: '',
      toggle: false,
      message: '',
      FavSongList: [],
      languageIcon
    }
  },
  components: {
    toastMessage
  },
  computed: {
    ...mapWritableState(useCommonStore, ['language']),
    ...mapWritableState(useUserStore, ['userLoggedIn', 'userName', 'uid', 'favSongList']),
    ...mapWritableState(useModalStore, ['isOpen'])
  },
  methods: {
    ...mapActions(useUserStore, ['signOut']),
    getAuth() {
      if (auth.currentUser) {
        this.userLoggedIn = true
        this.userName = auth.currentUser.displayName
        this.uid = auth.currentUser.uid
      }
    },
    toggleAuthModal() {
      if (!this.userLoggedIn) {
        this.isOpen = !this.isOpen
      } else {
        this.signOut()
        this.$router.push({ name: 'home' })
        this.hamburgerChange = false
        this.menu_hamberger_css = ''
      }
    },
    clickHamberMenu() {
      if (!this.hamburgerChange) {
        this.hamburgerChange = true
        this.menu_hamberger_css = 'hamburgerChange'
      } else {
        this.hamburgerChange = false
        this.menu_hamberger_css = ''
      }
    },
    forwardHome() {
      this.$router.push({ name: 'home' })
      this.hamburgerChange = false
      this.menu_hamberger_css = ''
      this.$route.meta.requireScreen = false
    },
    enterPage(content, menuLinkText) {
      const navigate = (menuLinkText) => {
        let routeName
        switch (menuLinkText) {
          case '我的播放清單':
          case 'Play List':
            routeName = 'favSongList'
            break
          case '製作自己的專輯':
          case 'Make Own Album':
            routeName = 'makeAlbum'
            break
          default:
            this.toggle = !this.toggle
            this.message = this.$t('ErroMsg.no_available_route')
            return
        }

        if (this.userLoggedIn) {
          this.$router.push({ name: routeName })
          this.hamburgerChange = false
          this.menu_hamberger_css = ''
        } else {
          this.toggle = !this.toggle
          this.message = content
        }
      }

      navigate(menuLinkText)
    },
    userLoginCheck(event) {
      this.enterPage(this.$t('ErroMsg.feature_unavailable_msg'), event.target.innerText)
    },
    enterMakeAlbumPage() {
      this.$router.push({ name: 'makeAlbum' })
      this.hamburgerChange = false
      this.menu_hamberger_css = ''
    },
    loginMemberStage() {
      if (!this.userLoggedIn) {
        this.isOpen = !this.isOpen
      } else {
        this.$router.push({ name: 'member-backStage', params: { uid: this.uid } })
        this.hamburgerChange = false
        this.menu_hamberger_css = ''
      }
    }
  },
  watch: {
    language(newVal, oldVal) {
      this.$i18n.locale = newVal
    }
  },
  mounted() {
    this.getAuth()
  }
}
</script>

<template>
  <toastMessage :toggle="toggle" :message="message" :success="false"></toastMessage>
  <header class="fixed top-0 left-0 text-zinc-200 w-full z-10">
    <nav class="lg:px-[5rem] sticky flex top-0 bg-gradient-to-r from-rose-500 to-pink-500 z-10">
      <div class="flex items-center p-2 gap-2 cursor-pointer" @click.prevent="forwardHome">
        <img src="../assets/images/logo-inverted.png" width="50" alt="" />
        <div class="font-bold text-2xl">
          earphone:
          <span class="text-sky-900 text-xl md:text-2xl">MUISC</span>
        </div>
      </div>

      <!-- *******************桌機選單************************** -->
      <!-- flex-1可以用將nav剩餘的寬度，全部給這個元素(div)使用 -->
      <div class="flex-1 md:flex hidden items-center justify-end">
        <div class="menu-item" @click.prevent="toggleAuthModal">
          <i class="fas fa-user pr-2"></i>
          <span v-if="!userLoggedIn">{{ $t('menu.sign_in_sign_up') }}</span>
          <span v-else>{{ $t('menu.logout') }}</span>
        </div>
        <div class="menu-item group" @click.prevent="enterMakeAlbumPage">
          <span>{{ $t('menu.make_your_own_album') }}</span>
        </div>
        <div class="menu-item" @click.prevent="userLoginCheck">
          <span>{{ $t('menu.play_list') }}</span>
        </div>
        <div class="menu-item" @click.prevent="loginMemberStage">
          <span>{{ $t('menu.member_managemnet') }}</span>
        </div>
      </div>

      <!-- *******************手機選單************************** -->
      <div class="flex items-center">
        <select
          class="truncate bg-transparent pb-2 pt-1 pl-2 pr-7 md:pr-8 rounded border border-gray-300 appearance-none"
          :style="`background-image: url(${languageIcon})`"
          v-model="language"
        >
          <option class="bg-pink-500" value="en">English</option>
          <option class="bg-pink-500" value="zh">中文</option>
        </select>
      </div>
      <div class="block md:hidden ml-auto p-3 my-auto cursor-pointer">
        <div
          id="mobile-menu-button"
          class="group peer"
          @click.prevent="clickHamberMenu"
          :class="menu_hamberger_css"
          ref="mobileMenu"
        >
          <div
            class="top-0 bg-zinc-200 rounded-full w-8 h-1 transition-all group-change:rotate-45 group-change:top-2 relative"
          ></div>
          <div
            class="my-1 bg-zinc-200 rounded-full w-8 h-1 opacity-100 transition-all group-change:opacity-0"
          ></div>
          <div
            class="top-0 bg-zinc-200 rounded-full w-8 h-1 transition-all group-change:-rotate-45 group-change:-top-2 relative"
          ></div>
        </div>
        <div
          class="peer-open:block hidden absolute bg-gradient-to-r from-rose-500 to-pink-500 w-full top-[62px] left-0"
        >
          <div
            class="relative flex h-full cursor-pointer items-center justify-center p-4 font-bold hover:text-zinc-200 transition-colors hover:bg-white/10"
            @click.prevent="toggleAuthModal"
          >
            <i class="fas fa-user pr-2"></i>
            <span v-if="!userLoggedIn">{{ $t('menu.sign_in_sign_up') }}</span>
            <span v-else>{{ $t('menu.logout') }}</span>
          </div>
          <div
            id="ticket-menu-item"
            class="group relative h-full cursor-pointer text-pink-200 transition-colors hover:bg-white/10 hover:text-zinc-200"
            @click.prevent="enterMakeAlbumPage"
          >
            <div class="p-4 text-center font-bold">{{ $t('menu.make_your_own_album') }}</div>
          </div>
          <div
            class="relative flex h-full cursor-pointer items-center justify-center p-4 font-bold hover:text-zinc-200 transition-colors hover:bg-white/10"
            @click.prevent="userLoginCheck"
          >
            <span>{{ $t('menu.play_list') }}</span>
          </div>
          <div
            class="relative flex h-full cursor-pointer items-center justify-center p-4 font-bold hover:text-zinc-200 transition-colors hover:bg-white/10"
            @click.prevent="loginMemberStage"
          >
            <span>{{ $t('menu.member_managemnet') }}</span>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
select {
  background-position:
    right 0.5em top 50%,
    0 0;
  background-size: 16px;
  background-repeat: no-repeat, repeat;
}
</style>
