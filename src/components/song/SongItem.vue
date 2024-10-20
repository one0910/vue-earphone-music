<script>
import { firebase, favoriteSongListCollection } from '@/includes/firebase'
import { mapActions, mapState, mapWritableState } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import toastMessage from '@/components/Alert/toastMessage.vue'

export default {
  data() {
    return {
      isCurrentPlaying: false,
      toggle: false,
      message: '',
      isFavSong: false,
      success: false
    }
  },
  components: {
    toastMessage
  },
  props: {
    songData: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState(usePlayerStore, ['playing', 'current_song', 'pauseCurrentSong']),
    ...mapState(useUserStore, ['userLoggedIn', 'uid']),
    ...mapWritableState(usePlayerStore, ['playingIndex']),
    ...mapWritableState(useUserStore, ['favSongList'])
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong']),
    playSong(song) {
      // console.log('current_song => ', this.current_song)
      // console.log('song => ', song)
      this.newSong(song)
      this.isCurrentPlaying = true
    },
    addToFav(songData) {
      if (!this.userLoggedIn) {
        this.toggle = !this.toggle
        this.message = this.$t('ErroMsg.feature_unavailable_msg')
      } else {
        this.setFavSongToDatabase(songData.docID)
        this.toggle = !this.toggle
        this.success = true
        this.message = this.$t('alertMsg.add_song_to_list', { favsongName: songData.modified_name })
      }
    },
    async delFormFav(songData) {
      try {
        const favoriteSongListRef = favoriteSongListCollection.doc(this.uid)
        await favoriteSongListRef.update({
          favSongLists: firebase.firestore.FieldValue.arrayRemove(songData.docID)
        })

        /*透過filter，將user stroe裡的favSongList做整理，只留下沒有被刪除的*/
        this.favSongList = this.favSongList.filter((doc) => {
          return songData.docID !== doc
        })
        this.isFavSong = false
        this.toggle = !this.toggle
        this.success = true
        // this.message = `已將 ${songData.modified_name} 從您的播放清單移除`
        this.message = this.$t('alertMsg.delete_song_form_play_list', {
          favsongName: songData.modified_name
        })
      } catch (error) {
        console.log('error => ', error)
      }
    },
    async setFavSongToDatabase(docID) {
      try {
        const favoriteSongListRef = favoriteSongListCollection.doc(this.uid)
        await favoriteSongListRef.update({
          favSongLists: firebase.firestore.FieldValue.arrayUnion(docID)
        })
        this.favSongList.push(docID)
        this.isFavSong = true
      } catch (error) {
        console.log('error => ', error)
      }
    }
  },
  mounted() {
    if (this.favSongList.length === 0) {
      return
    }
    this.isFavSong = this.favSongList.includes(this.songData.docID)
  },
  watch: {
    playing() {
      if (!this.current_song) {
        return
      }
      if (this.current_song.modified_name == this.songData.modified_name) {
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
  }
}
</script>

<template>
  <toastMessage :toggle="toggle" :message="message" :success="success"></toastMessage>
  <!-- 這邊也是用比較hardcore的方式直接做點擊播放音樂的功能，有時間再來調整CSS的結構 -->
  <p class="flex-1 truncate pr-3 cursor-pointer" @click.prevent="playSong(songData)">
    {{ songData.modified_name }}
  </p>
  <div class="flex cursor-pointer justify-center items-center" @click.prevent="playSong(songData)">
    <p class="flex-initial md:w-20 w-10">03:57</p>
    <div class="flex-initial md:w-12 w-10 md:text-center text-end">
      <i class="far fa-play-circle text-2xl text-rose-500/80" v-if="!isCurrentPlaying"></i>
      <i class="far fa-pause-circle text-2xl text-rose-500/80" v-else></i>
    </div>
  </div>
  <div v-if="!isFavSong" class="w-10 text-end cursor-pointer" @click.prevent="addToFav(songData)">
    <i class="far fa-heart text-2xl text-rose-500/80"></i>
  </div>
  <div v-else class="w-10 text-end cursor-pointer" @click.prevent="delFormFav(songData)">
    <i class="fas fa-heart text-2xl text-rose-500/80"></i>
  </div>
</template>
