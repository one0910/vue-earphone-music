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
        America: '美國流行音樂',
        Kpop: 'KPOP',
        Jpop: 'JPOP',
        Music: '鋼琴音樂',
        fundraising: '明日之星',
        default: '歌曲清單'
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
