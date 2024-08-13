<script>
import { mapActions, mapWritableState, mapState } from 'pinia'
import { useAlertConfirmStore } from '@/stores/alertConfirm'
import toastMessage from '@/components/Alert/toastMessage.vue'
import MemberSongEdit from '@/components/Edit/memberSongEdit.vue'
import alertDeleteConfirm from '@/components/Alert/alertDeleteConfirm.vue'
import { userCollection, albumsCollection, songsCollection, storage } from '@/includes/firebase'
import Loading from '@/components/Loading.vue'

export default {
  name: 'Member-Manage',
  data() {
    return {
      deleteTempAlbum: {},
      albums: [],
      albumID: '',
      profileName: '',
      unsaveFlag: false,
      toggle: false,
      showLoading: false
    }
  },
  components: {
    toastMessage,
    MemberSongEdit,
    alertDeleteConfirm,
    Loading
  },
  computed: {
    ...mapWritableState(useAlertConfirmStore, ['delData', 'deleteData', 'alertMessage'])
  },
  methods: {
    ...mapActions(useAlertConfirmStore, ['fireShowAlertConfirm']),
    async openAlbum(albumID) {
      this.toggle = !this.toggle
      this.albumID = albumID
    },
    async getAlbums(uid) {
      const { albums, name } = (await userCollection.doc(uid).get()).data()
      const snapshot = await albumsCollection
        .doc('fundraising')
        .collection(uid)
        .orderBy('createdAt', 'desc')
        .get()
      snapshot.forEach((doc) => {
        this.albums.push({ ...doc.data() })
      })

      this.profileName = name
      if (!albums) {
        return
      }
      albums.forEach((album) => {})
    },
    async deleteAlbum(album, index) {
      this.deleteTempAlbum = {
        ...album,
        index,
        urls: []
      }
      this.fireShowAlertConfirm({
        // msg: `是否刪除專輯【${album.albumName}】`
        msg: this.$t('alertMsg.delete_album', { albumName: album.albumName })
      })
    },

    /*刪除 collection album裡的資料 (items及所屬會員專輯的資料)*/
    async deleteAlbumCollection() {
      const albumRef = albumsCollection.doc('fundraising')
      const albumRefItem = await albumRef.get()
      const albumRefDoc = albumRef
        .collection(this.deleteTempAlbum.uid)
        .doc(this.deleteTempAlbum.albumID)

      const updatedItems = albumRefItem.data().items.filter((item) => {
        return this.deleteTempAlbum.albumID !== item.albumID
      })

      try {
        await albumRefDoc.delete()
        await albumRef.update({ items: updatedItems })
      } catch (error) {
        console.log('deleteAlbumCollection_error => ', error)
      }
    },
    /*刪除 song album裡的歌曲 (該張專輯的所有歌曲)*/
    async deleteSongCollection() {
      const snapshot = await songsCollection
        .where('albumID', '==', this.deleteTempAlbum.albumID)
        .get()

      try {
        snapshot.forEach(async (document) => {
          this.deleteTempAlbum.urls.push(document.data().url)
          await document.ref.delete()
        })
      } catch (error) {
        console.log('deleteSongCollection_error => ', error)
      }
    },
    /*刪除storage image圖片 (該張專輯放在storage裡的歌手、封面圖片)*/
    async deleteImgStorage() {
      const songAlbumImgRef = storage.refFromURL(this.deleteTempAlbum.albumImg)
      const songSignerImgRef = storage.refFromURL(this.deleteTempAlbum.albumSingerImg)
      try {
        await songAlbumImgRef.delete()
        await songSignerImgRef.delete()
      } catch (error) {
        console.log('deleteImgStorage_error => ', error)
      }
    },
    /*刪除storage song (該張專輯放在storage裡的歌曲)*/
    async deleteSongStorage() {
      try {
        this.deleteTempAlbum.urls.forEach(async (url, index) => {
          await storage.refFromURL(url).delete()
          // console.log(`${index}_storage.refFromURL=>`, storage.refFromURL(url))
        })
      } catch (error) {
        console.log('deleteSongStorage => ', error)
      }
    },
    closeTheWindow(isClosed) {
      if (isClosed.closed === true) {
        this.albumID = ''
      }
    }
  },
  watch: {
    async delData() {
      if (this.delData) {
        this.showLoading = true
        await this.deleteAlbumCollection()
        await this.deleteSongCollection()
        await this.deleteImgStorage()
        await this.deleteSongStorage()
        // this.showLoading = false
        window.location.reload()
      }
    },

    /*用alertMessage來判斷是否關閉alert的視窗*/
    alertMessage() {
      if (!this.alertMessage) {
        this.deleteTempAlbum = {}
      }
    }
  },
  mounted() {
    this.getAlbums(this.$route.params.uid)
  }
}
</script>

<template>
  <main class="text-zinc-200 bg-zinc-900 mt-[55px] pt-[10px] pb-[10px] mb-[90px] relative">
    <Loading :isShow="showLoading"></Loading>
    <alertDeleteConfirm></alertDeleteConfirm>
    <toastMessage></toastMessage>
    <MemberSongEdit
      :toggle="toggle"
      :albumID="albumID"
      @closeTheWindow="closeTheWindow"
    ></MemberSongEdit>
    <div
      class="p-6 md:w-[550px] w-full bg-gradient-to-b from-zinc-900 to-zinc-700 rounded md:border border-transparent md:border-gray-200/40 mx-auto"
    >
      <div class="flex justify-around gap-0 items-center">
        <label
          class="text-gray-500 flex justify-center w-28 h-28 rounded-full border-2 border-zinc-500"
        >
          <input type="file" class="hidden" @change="uploadSignerImg($event)" />
          <svg
            data-encore-id="icon"
            role="img"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-16 h-1w-16"
          >
            <path
              d="M10.165 11.101a2.5 2.5 0 0 1-.67 3.766L5.5 17.173A2.998 2.998 0 0 0 4 19.771v.232h16.001v-.232a3 3 0 0 0-1.5-2.598l-3.995-2.306a2.5 2.5 0 0 1-.67-3.766l.521-.626.002-.002c.8-.955 1.303-1.987 1.375-3.19.041-.706-.088-1.433-.187-1.727a3.717 3.717 0 0 0-.768-1.334 3.767 3.767 0 0 0-5.557 0c-.34.37-.593.82-.768 1.334-.1.294-.228 1.021-.187 1.727.072 1.203.575 2.235 1.375 3.19l.002.002.521.626zm5.727.657-.52.624a.5.5 0 0 0 .134.753l3.995 2.306a5 5 0 0 1 2.5 4.33v2.232H2V19.77a5 5 0 0 1 2.5-4.33l3.995-2.306a.5.5 0 0 0 .134-.753l-.518-.622-.002-.002c-1-1.192-1.735-2.62-1.838-4.356-.056-.947.101-1.935.29-2.49A5.713 5.713 0 0 1 7.748 2.87a5.768 5.768 0 0 1 8.505 0 5.713 5.713 0 0 1 1.187 2.043c.189.554.346 1.542.29 2.489-.103 1.736-.838 3.163-1.837 4.355m-.001.001z"
            ></path>
          </svg>
        </label>

        <div class="md:w-64 w-44">
          <h5>{{ $t('memberMamagePage.profile') }}</h5>
          <p>{{ profileName }}</p>
        </div>
      </div>

      <hr class="my-6" />
      <p class="mb-3">{{ $t('memberMamagePage.created_album') }}</p>
      <div class="grid grid-cols-4 gap-2">
        <div
          v-for="(album, index) in albums"
          :key="album.albumID"
          class="col-span-1 cursor-pointer relative"
        >
          <i
            class="fas fa-trash-alt absolute left-1 text-rose-500 hover:text-teal-500 text-xl"
            @click.prevent="deleteAlbum(album, index)"
          ></i>
          <img
            class="rounded-md"
            :src="album.albumImg"
            alt=""
            @click.prevent="openAlbum(album.albumID)"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped></style>
