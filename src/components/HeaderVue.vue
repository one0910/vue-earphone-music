<script>
import { mapWritableState, mapActions, mapState } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useModalStore } from '@/stores/modal'
import { auth, favoriteSongListCollection } from '@/includes/firebase'
import toastMessage from '@/components/Alert/toastMessage.vue'

export default {
  data() {
    return {
      hamburgerChange: false,
      menu_hamberger_css: '',
      toggle: false,
      message: '',
      FavSongList: []
    }
  },
  components: {
    toastMessage
  },
  computed: {
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
            routeName = 'favSongList'
            break
          case '製作自己的專輯':
            routeName = 'makeAlbum'
            break
          default:
            this.toggle = !this.toggle
            this.message = '沒找到指定的路由'
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
      this.enterPage('該功能需登入才可使用，可免費註冊使用', event.target.innerText)
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
          <span class="text-sky-900">MUISC</span>
        </div>
      </div>

      <!-- *******************桌機選單************************** -->
      <!-- flex-1可以用將nav剩餘的寬度，全部給這個元素(div)使用 -->
      <div class="flex-1 md:flex hidden items-center justify-end">
        <div class="menu-item" @click.prevent="toggleAuthModal">
          <i class="fas fa-user pr-2"></i>
          <span v-if="!userLoggedIn">登入/註冊</span>
          <span v-else>登出</span>
        </div>
        <div class="menu-item group" @click.prevent="enterMakeAlbumPage">
          <span>製作自己的專輯</span>
        </div>
        <div class="menu-item" @click.prevent="userLoginCheck">
          <span>我的播放清單</span>
        </div>
        <div class="menu-item" @click.prevent="loginMemberStage">
          <span>會員管理</span>
        </div>
      </div>

      <!-- *******************手機選單************************** -->
      <div class="block md:hidden ml-auto p-4 my-auto cursor-pointer">
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
            <span v-if="!userLoggedIn">登入/註冊</span>
            <span v-else>登出</span>
          </div>
          <div
            id="ticket-menu-item"
            class="group relative h-full cursor-pointer text-pink-200 transition-colors hover:bg-white/10 hover:text-zinc-200"
            @click.prevent="enterMakeAlbumPage"
          >
            <div class="p-4 text-center font-bold">製作自己的專輯</div>
          </div>
          <div
            class="relative flex h-full cursor-pointer items-center justify-center p-4 font-bold hover:text-zinc-200 transition-colors hover:bg-white/10"
            @click.prevent="userLoginCheck"
          >
            <span>我的播放清單</span>
          </div>
          <div
            class="relative flex h-full cursor-pointer items-center justify-center p-4 font-bold hover:text-zinc-200 transition-colors hover:bg-white/10"
            @click.prevent="loginMemberStage"
          >
            <span>會員管理</span>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style lang="scss" scoped></style>
