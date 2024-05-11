<script>
import { firebase, favoriteSongListCollection } from '@/includes/firebase'
import { useUserStore } from '@/stores/user'
import { usePlayerStore } from '@/stores/player'
import { useAlertConfirmStore } from '@/stores/alertConfirm'
import { mapWritableState, mapActions, mapState } from 'pinia'
import { songsCollection } from '@/includes/firebase'
import FavSongItem from '@/components/song/FavSongItem.vue'
import AlertDeleteConfirm from '@/components/Alert/alertDeleteConfirm.vue'
import logoImage from '@/assets/images/logo2.png'
import { watchEffect } from 'vue'
import helper from '@/includes/helper'

export default {
  data() {
    return {
      favSongs: [],
      currentSongCoverImg: logoImage,
      listHeightStyle: ''
    }
  },
  components: { FavSongItem, AlertDeleteConfirm },
  computed: {
    ...mapState(useUserStore, ['uid']),
    ...mapState(usePlayerStore, ['playing', 'current_song', 'pauseCurrentSong']),
    ...mapWritableState(useAlertConfirmStore, ['delData', 'delFavSong']),
    ...mapWritableState(useUserStore, ['favSongList']),
    ...mapWritableState(usePlayerStore, ['songList', 'playingIndex']),
    filter() {
      if (!this.current_song.coverImg && this.songList.length === 0) {
        return {
          filter: 'grayscale(50%)'
        }
      }
    }
  },
  methods: {
    ...mapActions(useAlertConfirmStore, ['delFavSongItemDoc']),
    ...mapActions(usePlayerStore, ['deleteSong']),
    getSongs() {
      try {
        this.favSongList.forEach(async (document) => {
          const Snapshot = await songsCollection.doc(document).get()
          this.favSongs.push({ ...Snapshot.data(), docID: document })
          this.songList.push({ ...Snapshot.data(), docID: document })
        })
      } catch (error) {
        console.log('error => ', error)
      }
    },

    /*這裡是用來偵測清單裡的<li></li> 是否已被渲染完成，是使用props做的*/
    isFinshRender(liRenderComplete) {
      if (liRenderComplete) {
        if (this.songList.length > 0) {
          this.currentSongCoverImg = this.songList[0].coverImg
        }
        helper.changeHightStyle(this.favSongList, this.$refs.listRef)
      }
    }
  },
  mounted() {
    /*1.先清空play store裡的播放清單資料，也就是初始化，
    下面步驟3去getSongs取得清單時，會再把清單倒回到songList裡*/
    this.songList = []
    // 2.掛載此頁面時, 調整清單高度
    if (this.favSongList.length == 0) {
      if (this.playing) {
        this.$refs.listRef.style.height = '388px'
      } else {
        this.$refs.listRef.style.height = '418px'
      }
    }
    // 3.去後端取得播放清單
    this.getSongs()

    /*4. 由於vue的watch無法監測陣列資料的變化(例如:splice、push)，
    所以使用watchEffect來深度監控favSongList這個陣列的變化*/
    watchEffect(() => {
      if (this.favSongList.length === 0) {
        this.currentSongCoverImg = logoImage
      }
    })
  },
  watch: {
    /*用來監控當按下彈跳視窗裡的刪除按鈕時的狀態，*/
    async delData() {
      // 這裡用delData變數來定義一個資料要帔刪除的狀態，delData = true時就是按下確定時
      if (this.delData) {
        const index = this.delFavSong.index
        //1.刪除firebase裡的資料
        try {
          const favoriteSongListRef = favoriteSongListCollection.doc(this.uid)
          await favoriteSongListRef.update({
            favSongLists: firebase.firestore.FieldValue.arrayRemove(this.favSongs[index].docID)
          })
        } catch (error) {
          console.log('error => ', error)
          return
        }

        //2.刪除這個componet裡的播放清單的資料
        this.favSongs.splice(index, 1)
        //3.刪除這個user store裡的播放清單的資料
        this.favSongList.splice(index, 1)
        //4.刪除這個play store裡播放品所存放的相關資料
        this.deleteSong(index)

        //5.最後將alterConfirm store的狀態恢復初始狀態
        this.delData = false
        this.delFavSong = {
          index: null,
          docID: ''
        }
      }
    },

    /*隨時監測play store裡, 目前播放歌曲的變化*/
    current_song() {
      /*當有歌曲被刪除時, 就會被trigger，執行下面的程式碼*/
      helper.changeHightStyle(this.favSongList, this.$refs.listRef)
      if (Object.keys(this.current_song).length === 0) {
        this.currentSongCoverImg = logoImage
      } else {
        this.currentSongCoverImg = this.current_song.coverImg
      }
    }
  }
}
</script>
<template>
  <main class="text-zinc-200 bg-zinc-900 mt-[55px] pt-[10px] pb-[10px] mb-[90px] relative">
    <AlertDeleteConfirm></AlertDeleteConfirm>
    <div
      class="bg-cover bg-center md:bg-fixed bg-no-repeat md:bg-cover h-full"
      :style="`background-image: url(${currentSongCoverImg})`"
    >
      <div class="bg-black/70 backdrop-blur-md w-full h-full">
        <div
          class="md:w-[550px] w-full bg-[#00000030] rounded md:border border-transparent md:border-gray-200/40 mx-auto"
        >
          <div class="w-56 mx-auto">
            <img :src="currentSongCoverImg" :style="filter" alt="" />
          </div>
          <div class="mt-2">
            <p class="text-center">我的播放清單</p>
          </div>
          <ul class="md:mx-5 mx-5" :style="listHeightStyle" ref="listRef">
            <li
              class="flex justify-center my-2"
              v-for="(favSong, index) in favSongs"
              :key="favSong.docID"
            >
              <FavSongItem
                :favSong="favSong"
                :index="index"
                :isFinshRender="isFinshRender"
              ></FavSongItem>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped></style>
