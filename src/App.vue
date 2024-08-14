<script>
import HeaderVue from '@/components/HeaderVue.vue'
import Player from '@/components/Player.vue'
import Auth from '@/components/Auth/Auth.vue'
import { useUserStore } from '@/stores/user'
import { useCommonStore } from './stores/common'
import { mapState, mapWritableState } from 'pinia'
import Loading from '@/components/Loading.vue'
import initialization from '@/includes/initialization'

export default {
  data() {
    return {
      showLoading: true
    }
  },
  components: {
    Auth,
    HeaderVue,
    Player,
    Loading
  },
  computed: {
    ...mapState(useUserStore, ['uid']),
    ...mapWritableState(useCommonStore, ['isMoblieScreen'])
  },
  mounted() {
    initialization(this, (setLanguageDone = false) => {
      setLanguageDone && (this.showLoading = false)
    })
  }
}
</script>

<template>
  <Loading :isShow="showLoading"></Loading>
  <HeaderVue></HeaderVue>
  <RouterView v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" mode="out-in"></component>
    </transition>
  </RouterView>
  <Player></Player>
  <Auth></Auth>
  <!-- <RouterView /> -->
</template>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.2s linear;
}

.fade-leave-to {
  transition: all 0.2s linear;
  opacity: 0;
}
</style>
