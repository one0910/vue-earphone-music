<script>
import HomeSongPlayZone from '@/components/HomeSongPlayZone.vue'
import HomeSongListZone from '@/components/HomeSongListZone.vue'
import toastMessage from '@/components/Alert/toastMessage.vue'
import SignScreen from '@/components/SignScreen.vue'

export default {
  components: {
    HomeSongPlayZone,
    HomeSongListZone,
    toastMessage,
    SignScreen
  }
}
</script>

<template>
  <main class="text-zinc-200 bg-zinc-900 mt-[55px] mb-[90px] relative">
    <toastMessage></toastMessage>
    <SignScreen></SignScreen>
    <HomeSongPlayZone></HomeSongPlayZone>
    <HomeSongListZone :gener="'fundraising'"></HomeSongListZone>
    <HomeSongListZone :gener="'America'"></HomeSongListZone>
    <HomeSongListZone :gener="'Kpop'"></HomeSongListZone>
    <HomeSongListZone :gener="'Jpop'"></HomeSongListZone>
    <HomeSongListZone :gener="'Music'"></HomeSongListZone>
  </main>
</template>
