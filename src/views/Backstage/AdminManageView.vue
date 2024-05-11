<script>
import toastMessage from '@/components/Alert/toastMessage.vue'
import UploadAdminManage from '@/components/Upload/Upload-AdminManage.vue'
import CompositionItem from '@/components/CompositionItem.vue'
import { songsCollection, auth } from '@/includes/firebase'

export default {
  name: 'Manage',
  data() {
    return {
      songs: [],
      unsaveFlag: false
    }
  },
  components: {
    toastMessage,
    UploadAdminManage,
    CompositionItem
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name
      this.songs[i].genre = values.genre
    },
    /*刪除掉呈現在UI畫面上的歌曲*/
    removeSong(i) {
      this.songs.splice(i, 1)
    },

    /*當把歌曲上存到firebase的storage及歌曲訊息寫到database後，
    在後台會立即把剛上傳的課顯示在歌曲列表*/
    addSong(document) {
      const song = {
        ...document.data(),
        docID: document.id
      }
      this.songs.push(song)
    },
    updateUnsaveFlag(value) {
      this.unsaveFlag = value
    }
  },
  async created() {
    const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()
    snapshot.forEach((document) => {
      this.addSong(document)
    })
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsaveFlag) {
      next()
    } else {
      const leave = confirm('你的檔案還未修改完必，有確定要離開嗎?')
      next(leave)
    }
  }
}
</script>

<template>
  <main class="text-zinc-200 bg-zinc-900 mt-[55px] mb-[90px] relative">
    <toastMessage></toastMessage>
    <section class="container mx-auto mt-14 pt-3 pr-1 md:pr-0">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
          <UploadAdminManage ref="upload" :addSong="addSong"></UploadAdminManage>
        </div>
        <div class="col-span-2">
          <div class="bg-zinc-900 rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-5 pb-3 font-bold border-b border-gray-200">
              <span class="card-title">我的歌單</span>
              <i class="fa fa-compact-disc float-right text-rose-400 text-xl"></i>
            </div>
            <div class="p-6">
              <CompositionItem
                v-for="(song, i) in songs"
                :key="song.docID"
                :song="song"
                :updateSong="updateSong"
                :index="i"
                :removeSong="removeSong"
                :updateUnsaveFlag="updateUnsaveFlag"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped></style>
