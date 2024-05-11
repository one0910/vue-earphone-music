<script>
import { usePlayerStore } from '@/stores/player'
import { mapActions, mapState } from 'pinia'

export default {
  name: 'Player',
  computed: {
    ...mapState(usePlayerStore, ['playing', 'seek', 'duration', 'playProgress', 'current_song'])
  },
  methods: {
    ...mapActions(usePlayerStore, ['toggleAudio', 'updateSeek', 'forward_backPlay'])
  }
}
</script>

<template>
  <div :class="{ hidden: $route.name === 'admin-backStage' }">
    <div
      class="fixed bottom-0 left-0 bg-zinc-800 pl-4 py-2 w-full text-zinc-200 shadow-[0_0_5px_rgba(255,255,255,1)] z-10"
      :class="{ 'pr-4': !current_song.album }"
    >
      <div class="flex justify-between items-center">
        <div class="flex-1">
          <!-- Track Info -->
          <div class="text-center" v-if="current_song.modified_name">
            <span class="font-bold text-md">{{ current_song.display_name }}</span> -
            <span class="font-bold text-md">{{ current_song.modified_name }}</span>
          </div>
          <div class="flex flex-nowrap gap-4 items-center">
            <!-- Current Position -->
            <div class="player-currenttime">{{ seek }}</div>
            <!-- Scrub Container  -->
            <div
              class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
              @click.prevent="updateSeek"
            >
              <!-- Player Ball -->
              <span
                class="absolute -top-2.5 -ml-2.5 text-gray-700 text-lg"
                :style="{ left: playProgress }"
              >
                <i class="fas fa-circle"></i>
              </span>
              <!-- Player Progress Bar-->
              <span
                class="block h-2 rounded bg-gradient-to-r from-rose-500 to-pink-500"
                :style="{ width: playProgress }"
              ></span>
            </div>
            <!-- Duration -->
            <div class="player-duration">{{ duration }}</div>
          </div>
          <div class="flex my-2">
            <img
              :src="current_song.coverImg"
              class="w-10"
              :class="{ 'opacity-0': !current_song['coverImg'] }"
              alt=""
            />
            <div class="flex-1 flex flex-nowrap justify-between px-2 md:px-5">
              <button type="button" @click.prevent="forward_backPlay(false)">
                <i class="fas fa-backward text-rose-500 text-2xl"></i>
              </button>
              <button type="button" @click.prevent="toggleAudio">
                <i
                  class="fas text-rose-500 text-3xl"
                  :class="{ 'fa-play': !playing, 'fa-pause': playing }"
                ></i>
              </button>
              <button type="button" @click.prevent="forward_backPlay(true)">
                <i class="fas fa-forward text-rose-500 text-2xl"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 波浪動畫 -->
        <div v-if="current_song.album" class="w-10 md:mr-4 md:ml-2">
          <div class="flex md:gap-1 gap-0.5 items-center justify-center">
            <div
              class="md:h-6 h-4 md:w-[5px] w-[3px] bg-rose-400 rounded-full animate-wavey"
              :class="{
                'animation-paused': !playing,
                'animation-running': playing
              }"
            ></div>
            <div
              class="md:h-7 h-5 md:w-[5px] w-[3px] bg-rose-300 rounded-full animate-wavey animation-delay-200"
              :class="{
                'animation-paused': !playing,
                'animation-running': playing
              }"
            ></div>
            <div
              class="md:h-8 h-6 md:w-[5px] w-[3px] bg-rose-200 rounded-full animate-wavey animation-delay-[150ms]"
              :class="{
                'animation-paused': !playing,
                'animation-running': playing
              }"
            ></div>
            <div
              class="md:h-9 h-7 md:w-[5px] w-[3px] bg-rose-300 rounded-full animate-wavey animation-delay-300"
              :class="{
                'animation-paused': !playing,
                'animation-running': playing
              }"
            ></div>
            <div
              class="md:h-6 h-4 md:w-[5px] w-[3px] bg-rose-400 rounded-full animate-wavey animation-delay-[75ms]"
              :class="{
                'animation-paused': !playing,
                'animation-running': playing
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
