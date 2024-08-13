<script>
import {
  storage,
  userCollection,
  albumsCollection,
  songsCollection,
  firebase
} from '@/includes/firebase'
import { useAlbumInfoStore } from '@/stores/albumInfo'
import { useUserStore } from '@/stores/user'
import { useAlertConfirmStore } from '@/stores/alertConfirm'
import { mapWritableState, mapState } from 'pinia'
import toastMessage from '@/components/Alert/toastMessage.vue'
import helper from '@/includes/helper'
import alertCompleteConfirm from '../Alert/alertCompleteConfirm.vue'
import Loading from '@/components/Loading.vue'
export default {
  data() {
    return {
      toggle: false,
      message: '',
      success: false,
      uploadsTemp: [],
      uploadAvilable: true,
      isComplete: false,
      showLoading: false
    }
  },
  components: { toastMessage, alertCompleteConfirm, Loading },
  computed: {
    ...mapWritableState(useAlbumInfoStore, ['albumMakeTemp']),
    ...mapWritableState(useAlertConfirmStore, ['isShowAlertConfirm']),
    ...mapState(useUserStore, ['uid']),
    canBeSubmit() {
      if (
        this.uid == '' ||
        this.albumMakeTemp.albumSinger == '' ||
        this.albumMakeTemp.albumName == '' ||
        this.albumMakeTemp.albumDesc == '' ||
        !this.albumMakeTemp.albumUploadSingnerImgFile.lastModified ||
        !this.albumMakeTemp.albumUploadAlbumImgFile.lastModified ||
        this.uploadsTemp.length === 0
      ) {
        return true
      }
    }
  },
  methods: {
    uploadSong($event) {
      const files = [...$event.target.files]
      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          this.toggle = !this.toggle
          this.message = `${file.name}非mp3檔，請重傳`
          return
        }
        this.uploadsTemp.push({
          file,
          current_progress: 0,
          icon: '',
          text_class: '',
          variant: '',
          isUploadComplete: false,
          isUploading: false
        })
      })
    },

    async uploadImage(file) {
      this.showLoading = true
      return new Promise((resolve, reject) => {
        const storageRef = storage.ref()
        const songsRef = storageRef.child(`images/${file.name}`)
        const task = songsRef.put(file)
        task.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            console.error('error => ', error)
            reject(error)
          },
          async () => {
            try {
              const ImgUrl = await task.snapshot.ref.getDownloadURL()
              resolve(ImgUrl)
            } catch (error) {
              console.error('error => ', error)
              reject(error)
            }
          }
        )
      })
    },
    async uploadSignerImg() {
      const signerImgFile = this.albumMakeTemp.albumUploadSingnerImgFile
      const ImgUrl = await this.uploadImage(signerImgFile)
      this.albumMakeTemp.albumSingerImg = ImgUrl
    },
    async uploadAlbumImg() {
      const albumImgFile = this.albumMakeTemp.albumUploadAlbumImgFile
      const ImgUrl = await this.uploadImage(albumImgFile)
      this.albumMakeTemp.albumImg = ImgUrl
    },

    async storeToAlbum() {
      const albumID = `album_${Date.now()}_${Math.floor(Math.random() * 10000)}`
      this.albumMakeTemp.albumID = albumID
      const album = {
        uid: this.uid,
        albumDesc: this.albumMakeTemp.albumDesc,
        albumImg: this.albumMakeTemp.albumImg,
        albumName: this.albumMakeTemp.albumName,
        albumSinger: this.albumMakeTemp.albumSinger,
        albumGenre: this.albumMakeTemp.albumGenre.toLocaleLowerCase(),
        albumSingerDesc: this.albumMakeTemp.albumSingerDesc,
        albumSingerImg: this.albumMakeTemp.albumSingerImg,
        albumID,
        isRelease: false,
        type: 'member_fundraising',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        fundraising_total: 500000,
        fundraising_raised: 0,
        fundraising_count: 0,
        fundraising_dueDate: '2024-11-01'
      }
      const albumFundrasingRef = albumsCollection.doc('fundraising')
      const userCollectionRef = userCollection.doc(this.uid)
      try {
        const doc = await albumFundrasingRef.get()
        if (doc.exists) {
          /* 1.先把專輯資訊寫入到名稱為fundraising的doc裡，由於一個user可能會有多個自建的專輯，
          所以再從此doc建立一個useid的子collection來放各各自建的專輯，然後再用albumID來建立獨立的document來放置所建置的專輯資料*/
          await albumFundrasingRef.collection(this.uid).doc(albumID).set(album)
          /* 由於firebase database裡的document，欄位為陣列格式，裡面的資料則不支援回傳FieldValue.serverTimestamp()的功能
          所以為了避免firebase報錯，這裡把createdAt這個時間戳改成前端的Date.now()來取得
          */
          album.createdAt = Date.now()

          /*2. 然後在fundraising的document裡，再加入一個items的陣列欄位，用來放置所有自建的所有專輯資料
          以方便之後在某個頁面裡，可以先把所有的自建專輯先全部列出來
         */
          await albumFundrasingRef.update({
            items: firebase.firestore.FieldValue.arrayUnion(album)
          })
        } else {
          await albumsCollection.doc('fundraising').collection(this.uid).doc(albumID).set(album)
          album.createdAt = Date.now()
          await albumsCollection.doc('fundraising').set({ items: [album] })
        }

        /*3. 最後再把該次建立的albumID，送到user的album陣列裡，以方便之後建立會員中心時方便查找所建立的album資料*/
        await userCollectionRef.update({
          albums: firebase.firestore.FieldValue.arrayUnion(albumID)
        })
      } catch (error) {
        console.error('Error updating document: ', error)
        return
      }
    },

    async storeToSong() {
      this.showLoading = false
      this.uploadsTemp.forEach((file, index) => {
        const storageRef = storage.ref()
        const songsRef = storageRef.child(`fundraising_songss/${file['file'].name}`)

        const task = songsRef.put(file['file'])
        this.uploadsTemp[index].icon = 'fas fa-spinner fa-spin'
        this.uploadsTemp[index].variant = 'bg-blue-400'
        this.uploadsTemp[index].isUploading = true
        task.on(
          'state_changed',
          (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.uploadsTemp[index].current_progress = progress
          },
          (error) => {
            this.uploadsTemp[index].variant = 'bg-red-400'
            this.uploadsTemp[index].icon = 'fa fa-times'
            this.uploadsTemp[index].text_class = 'text-red-400'
          },
          async () => {
            try {
              const song = {
                albumID: this.albumMakeTemp.albumID,
                album: this.albumMakeTemp.albumName,
                coverImg: this.albumMakeTemp.albumImg,
                uid: this.uid,
                display_name: this.albumMakeTemp.albumSinger,
                original_name: task.snapshot.ref.name,
                modified_name: helper.formatSongName(task.snapshot.ref.name),
                genre: this.albumMakeTemp.albumGenre.toLowerCase(),
                comment_count: 0,
                type: 'member_fundingraise',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
              }
              song.url = await task.snapshot.ref.getDownloadURL()
              await songsCollection.add(song)
            } catch (error) {
              console.log('error => ', error)
              return
            }
            this.uploadsTemp[index].variant = 'bg-green-400'
            this.uploadsTemp[index].icon = 'fa fa-check'
            this.uploadsTemp[index].text_class = 'text-green-400'
            this.uploadsTemp[index].isUploadComplete = true

            if (this.uploadsTemp.length - 1 === index) {
              this.isComplete = true
              this.uploadAvilable = false
            }
          }
        )
      })
    },

    deleteSong(index) {
      if (this.uploadsTemp.length < 1) {
        return
      }
      this.uploadsTemp.splice(index, 1)
    },

    async submit() {
      await this.uploadSignerImg()
      await this.uploadAlbumImg()
      await this.storeToAlbum()
      await this.storeToSong()
    },

    formatIndex: helper.formatIndex,
    formatSongName: helper.formatSongName
  },
  mounted() {
    if (!this.uid) {
      this.toggle = !this.toggle
      this.message = this.$t('ErroMsg.login_to_use')
    }
  }
}
</script>

<template>
  <Loading :isShow="showLoading"></Loading>
  <alertCompleteConfirm :isShow="isComplete"></alertCompleteConfirm>
  <toastMessage :toggle="toggle" :message="message" :success="success"></toastMessage>
  <div class="p-6">
    <label
      class="cursor-pointer py-1.5 px-3 mr-2 rounded text-zinc-100 bg-rose-500 hover:bg-rose-600 disabled:bg-zinc-700 disabled:text-zinc-400"
    >
      <input type="file" class="hidden" multiple @change="uploadSong($event)" />
      <span>{{ $t('button.upload_song') }}</span>
    </label>

    <div class="mt-4">
      <p class="mb-3 border-b-2 border-[#fff]/30 pb-2">
        {{ $t('makeAlbumPage.the_song_you_want_to_upload') }}:
      </p>
      <div class="mb-4" v-for="(upload, index) in uploadsTemp" :key="upload['file'].name">
        <!-- File Name -->
        <div
          class="border border-zinc-200 p-2 mb-4 rounded font-bold text-sm"
          :class="upload.text_class"
        >
          <div class="flex items-center justify-between">
            <div class="overflow-hidden flex items-center">
              <i :class="upload.icon"></i>
              <p class="pl-2 truncate">
                {{ formatIndex(index) }}. {{ formatSongName(upload['file'].name) }}
              </p>
            </div>
            <div class="">
              <button
                v-if="!upload.isUploadComplete"
                class="ml-1 py-1 px-2 text-sm rounded text-white bg-rose-600"
                @click.prevent="deleteSong(index)"
              >
                <i class="fa fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <div v-if="upload.isUploading" class="flex h-4 mt-1 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :style="{ width: upload.current_progress + '%' }"
            :class="upload.variant"
          ></div>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <div :class="{ 'opacity-0': uid }">
          <span class="text-sm text-pink-600">{{ $t('alertMsg.registered_yet') }}</span>
        </div>
        <button
          v-if="uploadAvilable"
          type="submit"
          class="py-1 px-3 mr-2 rounded text-zinc-100 bg-rose-500 w-30 hover:bg-rose-600 disabled:bg-zinc-700 disabled:text-zinc-400"
          :disabled="canBeSubmit"
          @click="submit"
        >
          {{ $t('button.confirm_upload') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
