<script>
import SwiperSong from './song/SwiperSong.vue'
export default {
  props: {
    gener: {
      type: String,
      required: true
    }
  },
  components: {
    SwiperSong
  },
  computed: {
    generHead() {
      const labels = {
        America: this.$t('home.america_pop_title'),
        Kpop: 'KPOP',
        Jpop: 'JPOP',
        Music: this.$t('home.piano_pop_title'),
        fundraising: this.$t('home.tomorrow_stars_title'),
        default: this.$t('menu.play_list')
      }[this.gener]
      return labels || labels['default']
    }
  }
}
</script>

<template>
  <section class="max-w-[1400px] mx-auto pl-2 pb-[35px]">
    <h6 class="border-l-[7px] border-rose-500 bg-[#9b27504a] py-1 pl-[15px]">
      {{ generHead }}
    </h6>
    <SwiperSong :gener="gener"></SwiperSong>
  </section>
</template>
