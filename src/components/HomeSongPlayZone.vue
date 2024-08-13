<script>
import { songsCollection } from '@/includes/firebase'
import { mapState, mapActions, mapWritableState } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import { useCommonStore } from '@/stores/common'
import helper from '@/includes/helper'

export default {
  name: 'HomeSongPlay',
  data() {
    return {
      songs: [],
      isPlaying: false,
      pause: false,
      backImage: 'https://i.imgur.com/Mjs5yOr.jpg',
      homePlayList: [
        'awD3iFkG2dmt4E9Oc8gu',
        'xrftJ03d44UNT7Gm6T8f',
        'pOrIB7mjQjnDdEJtpTsg',
        'u0KPcCl3RyRBlfLB7udg',
        'RBCnCji0uqExquAhqHEF',
        'Gen1NSVenV3QfHzSAPkN',
        'MibHYBTMBqQhbNvCjloa',
        'xeA3kFMhLPwMAPU4ky4A',
        'WEo5iN1IopUxaXZPBBwl',
        'aJgIHyg7uk3dZ2CmuLV0',
        '5lwjpimV1csVAoKdt85n',
        'EZTFMSYU7Jg8yZBzioBs'
      ]
    }
  },
  computed: {
    ...mapState(usePlayerStore, ['sound', 'playing', 'songList', 'current_song']),
    ...mapState(useCommonStore, ['language', 'isMoblieScreen']),
    ...mapWritableState(usePlayerStore, ['songList'])
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong', 'toggleAudio']),
    async getSong() {
      // const americaSnapshot = await songsCollection.where('genre', '==', 'America').limit(4).get()
      this.homePlayList.forEach(async (document) => {
        const Snapshot = await songsCollection.doc(document).get()
        this.songs.push({ ...Snapshot.data() })
      })
    },
    clickPlay() {
      let num = helper.RangeInt(0, this.songs.length - 1)
      this.songList = this.songs
      if (!this.isPlaying) {
        this.isPlaying = true
        this.newSong(this.songs[0])
        this.backImage = this.songs[num].coverImg
      } else {
        this.toggleAudio()
      }

      if (this.isPlaying && !this.pause) {
        this.pause = true
      } else if (this.isPlaying && this.pause) {
        this.pause = false
      }
    }
  },
  watch: {
    playing() {
      if (this.playing) {
        this.pause = true
      } else {
        this.pause = false
      }
    },
    current_song() {
      // console.log(' this.current_song=> ', this.current_song)
      this.backImage = this.current_song.coverImg
    }
  },
  mounted() {
    this.getSong()
  }
}
</script>
<template>
  <div
    class="md:mb-8 bg-contain bg-center md:bg-fixed bg-no-repeat md:bg-contain flex flex-col min-h-[100px] items-center justify-center h-[calc(100vh-250px)] md:h-[calc(100vh-200px)]"
    :style="`background-image: url(${backImage})`"
  >
    <div class="bg-white/30 py-7 px-9 rounded-xl text-center backdrop-blur-md">
      <div class="relative">
        <img src="../assets/images/logo.png" alt="" class="md:w-[300px] w-[250px]" />
        <div
          class="flex items-center justify-center md:mt-[-110px] mt-[-100px] cursor-pointer"
          @click.prevent="clickPlay"
        >
          <div
            v-if="!isPlaying"
            class="playButton bg-pink-500 w-20 h-20 rounded-full flex md:gap-1.5 gap-1 items-center justify-center mb-5"
          >
            <i class="fas fa-play text-3xl text-zinc-200"></i>
            <!-- <i class="fas fa-pause text-3xl text-zinc-200"></i> -->
          </div>
          <div
            v-else-if="isPlaying && pause"
            class="bg-pink-500 w-20 h-20 rounded-full flex md:gap-1.5 gap-1 items-center justify-center mb-5"
          >
            <div class="md:h-8 h-6 w-1.5 bg-pink-300 rounded-full animate-wavey"></div>
            <div
              class="md:h-9 h-7 w-1.5 bg-pink-200 rounded-full animate-wavey animation-delay-200"
            ></div>
            <div
              class="md:h-10 h-8 w-1.5 bg-pink-100 rounded-full animate-wavey animation-delay-[150ms]"
            ></div>
            <div
              class="md:h-11 h-9 w-1.5 bg-pink-200 rounded-full animate-wavey animation-delay-300"
            ></div>
            <div
              class="md:h-8 h-6 w-1.5 bg-pink-300 rounded-full animate-wavey animation-delay-[75ms]"
            ></div>
          </div>
          <div
            v-else-if="isPlaying && !pause"
            class="bg-pink-500 w-20 h-20 rounded-full flex md:gap-1.5 gap-1 items-center justify-center mb-5"
          >
            <i class="fas fa-pause text-3xl text-zinc-200"></i>
          </div>
        </div>
      </div>
      <div v-if="!isPlaying" class="text-lg font-bold">{{ $t('home.give_it_a_listen') }}</div>
      <div v-else class="text-lg font-bold text-pink-500">{{ current_song.album }}</div>
    </div>
    <div
      class="font-bold text-[13px] md:text-sm mt-3"
      :class="{
        'text-center': language === 'en',
        'w-[50%]': language === 'en' && !isMoblieScreen
      }"
    >
      <span class="italic font-normal">{{ $t('home.cliam') }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
