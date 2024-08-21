<script>
import { usePlayerStore } from '@/stores/player'
import { mapActions, mapState } from 'pinia'
import helper from '@/includes/helper'
import { transSingerName, transSingerName_fund } from '@/helper/transform.language'

export default {
  name: 'Player',
  data() {
    return {
      sliderValue: 0, // 滑块的初始值
      timerId: null // 定时器ID
    }
  },
  computed: {
    ...mapState(usePlayerStore, [
      'playing',
      'seek',
      'duration',
      'playProgress',
      'current_song',
      'hiddenClass'
    ]),
    signerName() {
      const { display_name } = this.current_song
      return transSingerName(display_name)
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['toggleAudio', 'updateSeek', 'forward_backPlay'])
  },
  watch: {
    seek() {
      if (this.seek) {
        this.sliderValue = helper.convertPercentageToNumber(this.playProgress)
      }
    }
  }
}
</script>

<template>
  <div :class="hiddenClass || { hidden: $route.name === 'admin-backStage' }">
    <div
      class="fixed bottom-0 left-0 bg-zinc-800 pl-4 py-2 w-full text-zinc-200 shadow-[0_0_5px_rgba(255,255,255,1)] z-10"
      :class="{ 'pr-4': !current_song.album }"
    >
      <div class="flex justify-between items-center">
        <div class="flex-1">
          <!-- Track Info -->
          <div class="text-center" v-if="current_song.modified_name">
            <span class="font-bold text-md">{{ signerName }}</span> -
            <span class="font-bold text-md">{{ current_song.modified_name }}</span>
          </div>
          <div class="flex flex-nowrap gap-4 items-center">
            <!-- Current Position -->
            <div class="player-currenttime">{{ seek }}</div>
            <!-- Scrub Container  -->
            <div class="relative w-full">
              <input
                id="large-range"
                type="range"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
                max="100"
                min="0"
                v-model="sliderValue"
                @change="updateSeek($event)"
              />
              <span
                class="absolute top-[10px] left-0 block h-2 rounded bg-gradient-to-r from-rose-500 to-pink-500"
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

<style lang="scss" scoped>
input[type='range']::-webkit-slider-thumb {
  /* border: 15px dotted rgb(22, 48, 143); */
  -webkit-appearance: none;
  position: relative; /* 設為相對位置，為了前後區塊的絕對位置而設定 */
  width: 20px;
  height: 20px;
  /* background: rgb(55 65 81 / var(--tw-text-opacity)); */
  background: rgb(55 65 81 / var(--tw-text-opacity)) !important;
  border-radius: 50%;
  transition: 0.2s;
  z-index: 1;
}

input[type='range']::-webkit-slider-thumb:active {
  border: 25px solid rgb(55 65 81 / var(--tw-text-opacity));
  @media screen and (max-width: 768px) {
    border: 30px solid rgb(55 65 81 / var(--tw-text-opacity));
  }
}
</style>
