<script>
import { usePlayerStore } from '@/stores/player'
import { useAlertConfirmStore } from '@/stores/alertConfirm'
import { useUserStore } from '@/stores/user'
import { mapState, mapActions, mapWritableState } from 'pinia'

export default {
  name: 'FavSongItem',
  data() {
    return {
      isCurrentPlaying: false
    }
  },
  props: {
    favSong: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    isFinshRender: {
      type: Function,
      required: true
    }
  },
  computed: {
    ...mapState(usePlayerStore, ['playing', 'current_song', 'pauseCurrentSong']),
    ...mapState(useUserStore, ['favSongList']),
    ...mapWritableState(usePlayerStore, ['playingIndex']),
    ...mapWritableState(useAlertConfirmStore, ['delFavSong', 'isShowAlertConfirm'])
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong']),
    ...mapActions(useAlertConfirmStore, ['fireShowAlertConfirm']),
    playSong(song) {
      // console.log('current_song => ', this.current_song)
      // console.log('song => ', song)
      this.newSong(song)
      this.isCurrentPlaying = true
    },
    delSongFromList(docID, index) {
      this.delFavSong['index'] = index
      this.delFavSong['docID'] = docID
      this.fireShowAlertConfirm({
        msg: this.$t('alertMsg.delete_favsong', { favsongName: this.favSong.modified_name })
        // msg: `是否將${this.favSong.modified_name}從清單中刪除`
      })
    }
  },
  watch: {
    playing() {
      if (!this.current_song) {
        return
      }
      if (this.current_song.modified_name == this.favSong.modified_name) {
        this.isCurrentPlaying = true
        this.playingIndex = this.index
      } else {
        this.isCurrentPlaying = false
      }
    },
    pauseCurrentSong() {
      if (!this.pauseCurrentSong) {
        return
      }
      if (this.pauseCurrentSong.pause) {
        if (this.current_song.modified_name == this.pauseCurrentSong.currentSong) {
          this.isCurrentPlaying = false
        } else {
          this.isCurrentPlaying = true
        }
      }
    }
  },
  mounted() {
    if (this.index === this.favSongList.length - 1) {
      this.isFinshRender(true)
    }
  }
}
</script>
<template>
  <div class="w-12 mr-4">
    <img class="rounded-md" :src="favSong.coverImg" alt="" />
  </div>
  <div class="flex flex-1 justify-between border-b border-b-zinc-200/30 items-center">
    <!-- 這邊用比較hardcore的方式直接做點擊播放音樂的功能，有時間再來調整CSS的結構 -->
    <div class="cursor-pointer pr-3 flex-1" @click.prevent="playSong(favSong)">
      <p class="pr-3 flex-initial truncate md:w-80 w-44">
        {{ favSong.modified_name }}
      </p>
      <p class="text-zinc-500 text-sm">{{ favSong.display_name }}</p>
    </div>
    <div class="flex justify-between w-28">
      <div class="cursor-pointer flex items-center" @click.prevent="playSong(favSong)">
        <p class="flex-initial w-14 text-start">03:57</p>
        <div class="flex-initial md:text-center text-start">
          <i class="far fa-play-circle text-2xl text-rose-500/80" v-if="!isCurrentPlaying"></i>
          <i class="far fa-pause-circle text-2xl text-rose-500/80" v-else></i>
        </div>
      </div>
      <div>
        <i
          class="fas fa-minus-square text-2xl text-rose-500/80 cursor-pointer"
          @click.prevent="delSongFromList(favSong.docID, index)"
        ></i>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
