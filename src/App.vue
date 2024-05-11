<script>
import HeaderVue from '@/components/HeaderVue.vue'
import Player from '@/components/Player.vue'
import Auth from '@/components/Auth/Auth.vue'

export default {
  components: {
    Auth,
    HeaderVue,
    Player
  }
}
</script>

<template>
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
