<script>
import { albumsCollection, songsCollection } from '@/includes/firebase'
import { mapState, mapWritableState, mapActions } from 'pinia'
import { useAlertConfirmStore } from '@/stores/alertConfirm'
import { useUserStore } from '@/stores/user'
import { useAlbumInfoStore } from '@/stores/albumInfo'
import SongInfoEdit from '@/components/Edit/songInfoEdit.vue'
import SongUploadedEdit from '@/components/Edit/songUploadedEdit.vue'
import Loading from '@/components/Loading.vue'
export default {
  data() {
    return {
      close: true,
      showLoading: false
    }
  },
  props: ['toggle', 'albumID'],
  emits: ['closeTheWindow'],
  components: {
    SongInfoEdit,
    SongUploadedEdit,
    Loading
  },
  computed: {
    ...mapState(useAlertConfirmStore, ['isShowAlertConfirm']),
    ...mapState(useUserStore, ['uid']),
    ...mapWritableState(useAlbumInfoStore, ['albumEditTemp'])
  },
  methods: {
    ...mapActions(useAlbumInfoStore, ['initalbumEditTemp']),
    closeAlbumInfo() {
      this.close = true
      this.$emit('closeTheWindow', { closed: true })
      this.initalbumEditTemp()
    },
    async getAlbumData(albumID) {
      this.showLoading = true
      const snapshot = await albumsCollection
        .doc('fundraising')
        .collection(this.uid)
        .doc(albumID)
        .get()

      const albumData = snapshot.data()
      this.albumEditTemp.albumDesc = albumData.albumDesc
      this.albumEditTemp.isRelease = albumData.isRelease
      this.albumEditTemp.albumGenre =
        albumData.albumGenre[0].toUpperCase() + albumData.albumGenre.substring(1)
      this.albumEditTemp.albumID = albumData.albumID
      this.albumEditTemp.albumImg = albumData.albumImg
      this.albumEditTemp.albumName = albumData.albumName
      this.albumEditTemp.albumSinger = albumData.albumSinger
      this.albumEditTemp.albumSingerDesc = albumData.albumSingerDesc
      this.albumEditTemp.albumSingerImg = albumData.albumSingerImg
    },
    async getSongs(albumID) {
      const snapshot = await songsCollection.where('albumID', '==', albumID).get()
      snapshot.forEach((document) => {
        this.albumEditTemp.albumSongs.push({
          ...document.data(),
          docID: document.id
        })
      })
    }
  },
  watch: {
    toggle() {
      this.close = false
    },
    async albumID() {
      if (this.albumID) {
        /*1.先取得專輯資訊*/
        await this.getAlbumData(this.albumID)
        /*2.再去取得歌曲*/
        await this.getSongs(this.albumID)
        this.showLoading = false
      }
    }
  }
}
</script>
<template>
  <!-- Main modal -->
  <Loading :isShow="showLoading"></Loading>

  <div
    tabindex="-1"
    aria-hidden="true"
    class="overflow-y-auto overflow-x-hidden fixed top-0 bg-gray-900/70 right-0 left-0 z-40 justify-center items-center w-full md:inset-0 h-modal h-full px-3 md:px-0"
    :class="{ hidden: close }"
  >
    <div class="relative top-[10px] md:m-auto w-full max-w-5xl h-auto">
      <!-- Modal content -->
      <div class="relative py-2 text-center bg-zinc-800 rounded-lg shadow dark:bg-gray-800">
        <!-- 視窗右上角關閉按照 X -->
        <button
          type="button"
          class="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          @click="closeAlbumInfo"
        >
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="mx-2 flex justify-between md:flex-row flex-col gap-3">
          <!-- 左側側的專輯資訊 -->
          <SongInfoEdit :isClose="close"></SongInfoEdit>
          <!-- 右側的上傳歌曲列表 -->
          <SongUploadedEdit :isClose="close"></SongUploadedEdit>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
