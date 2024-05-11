<script>
import { mapWritableState, mapActions, mapState } from 'pinia'
import { useAlbumInfoStore } from '@/stores/albumInfo'
import { useUserStore } from '@/stores/user'
import helper from '@/includes/helper'
import { storage, albumsCollection, songsCollection, firebase } from '@/includes/firebase'
import Loading from '@/components/Loading.vue'
import toastMessage from '@/components/Alert/toastMessage.vue'

export default {
  data() {
    return {
      showLoading: false,
      toggle: false,
      message: '',
      uploadsNesSongs: [],
      deleteAlbumSongs: []
    }
  },
  props: ['isClose'],
  components: {
    Loading,
    toastMessage
  },
  computed: {
    ...mapWritableState(useAlbumInfoStore, ['albumEditTemp']),
    ...mapState(useUserStore, ['uid'])
  },
  methods: {
    ...mapActions(useAlbumInfoStore, ['initalbumEditTemp']),

    /*圖片上傳及處理*/
    async imageHandler(imgType) {
      return new Promise((resolve, reject) => {
        const storageRef = storage.ref()
        const albumUploadSingerImgFile = this.albumEditTemp.albumUploadSingnerImgFile
        const albumUploadAlbumImgFile = this.albumEditTemp.albumUploadAlbumImgFile
        const songSignerImgRef = storage.refFromURL(this.albumEditTemp.albumSingerImg)
        const songAlbumImgRef = storage.refFromURL(this.albumEditTemp.albumImg)

        if (imgType === 'singerImg' && albumUploadSingerImgFile.lastModified) {
          const songsRef = storageRef.child(`images/${albumUploadSingerImgFile.name}`)
          const task = songsRef.put(albumUploadSingerImgFile)
          task.on(
            'state_changed',
            (snapshot) => {},
            (error) => {
              console.error('error => ', error)
              reject(error)
            },
            async () => {
              try {
                await songSignerImgRef.delete()
                const ImgUrl = await task.snapshot.ref.getDownloadURL()
                // this.albumEditTemp.albumSingerImg = ImgUrl
                resolve(ImgUrl)
              } catch (error) {
                console.error('error => ', error)
              }
            }
          )
        } else if (imgType === 'albumImg' && albumUploadAlbumImgFile.lastModified) {
          const songsRef = storageRef.child(`images/${albumUploadAlbumImgFile.name}`)
          const task = songsRef.put(albumUploadAlbumImgFile)
          task.on(
            'state_changed',
            (snapshot) => {},
            (error) => {
              console.error('error => ', error)
              reject(error)
            },
            async () => {
              try {
                await songAlbumImgRef.delete()
                const ImgUrl = await task.snapshot.ref.getDownloadURL()
                console.log('ImgUrl_album => ', ImgUrl)
                resolve(ImgUrl)
                // this.albumEditTemp.albumImg = ImgUrl
              } catch (error) {
                console.error('error => ', error)
              }
            }
          )
        } else {
          resolve()
        }
      })
    },

    /*要修改的專輯資料更新到album cllection 相對應的document*/
    async updateAlbumData() {
      const albumRef = albumsCollection.doc('fundraising')
      const albumRefItem = await albumRef.get()
      const albumRefDoc = albumRef.collection(this.uid).doc(this.albumEditTemp.albumID)

      /*將要更新的專案資料用淺拷貝的方式複製一份出來, 這麼做的目的是有些field不需要, 要刪除掉*/
      const newAlbum = {
        ...this.albumEditTemp,
        albumGenre: this.albumEditTemp.albumGenre.toLocaleLowerCase()
      }
      delete newAlbum.albumUploadAlbumImgFile
      delete newAlbum.albumUploadSingnerImgFile
      delete newAlbum.albumSongs
      delete newAlbum.isLoading

      const updatedItems = albumRefItem.data().items.map((item) => {
        if (this.albumEditTemp.albumID === item.albumID) {
          return {
            ...item,
            ...newAlbum
          }
        }
        return item
      })

      /*先更新albums Collection裡的fundraising doc的items 陣列*/
      await albumRef.update({ items: updatedItems })
      /*再更新albums Collection裡的fundraising doc的相對應的會員專輯裡的資料*/
      await albumRefDoc.update({
        ...newAlbum
      })
    },

    /*要修改的專輯資料更新到song cllection 相對應的document*/
    async updateSongData() {
      const snapshot = await songsCollection
        .where('albumID', '==', this.albumEditTemp.albumSongs[0].albumID)
        .get()
      snapshot.forEach((document) => {
        document.ref.update({
          display_name: this.albumEditTemp.albumSinger,
          coverImg: this.albumEditTemp.albumImg,
          album: this.albumEditTemp.albumName
        })
      })
    },

    addNewSong($event) {
      const files = [...$event.target.files]
      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          this.toggle = !this.toggle
          this.message = `${file.name}非mp3檔，請重傳`
          return
        }
        this.uploadsNesSongs.push(file)
      })
    },

    deleteAlbumSong(songUrl, docID, index) {
      this.deleteAlbumSongs.push({ songUrl, docID })
      this.albumEditTemp.albumSongs.splice(index, 1)
    },
    async deleteSongFromStorage() {
      const delSongs = this.deleteAlbumSongs

      if (delSongs.length < 1) {
        return
      } else {
        return new Promise((resolve, reject) => {
          delSongs.forEach(async (song, index) => {
            const songRef = storage.refFromURL(song.songUrl)
            console.log('songRef => ', songRef)
            try {
              await songRef.delete()
              await songsCollection.doc(song.docID).delete()
              if (index === delSongs.length - 1) {
                resolve()
              }
            } catch (error) {
              console.log('catch_error => ', error)
            }
          })
        })
      }
    },

    /*將新增的歌曲存到storage*/
    async storeToSong() {
      const uploadSongs = this.uploadsNesSongs
      if (uploadSongs.length < 1) {
        return
      } else {
        return new Promise((resolve, reject) => {
          uploadSongs.forEach((file, index) => {
            const storageRef = storage.ref()
            const songsRef = storageRef.child(`fundraising_songss/${file.name}`)
            const task = songsRef.put(file)
            task.on(
              'state_changed',
              (snapshot) => {},
              (error) => {
                console.log('task_error => ', error)
              },
              async () => {
                try {
                  const song = {
                    albumID: this.albumEditTemp.albumID,
                    album: this.albumEditTemp.albumName,
                    coverImg: this.albumEditTemp.albumImg,
                    uid: this.uid,
                    display_name: this.albumEditTemp.albumSinger,
                    original_name: task.snapshot.ref.name,
                    modified_name: helper.formatSongName(task.snapshot.ref.name),
                    genre: this.albumEditTemp.albumGenre.toLowerCase(),
                    comment_count: 0,
                    type: 'member_fundingraise',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                  }
                  song.url = await task.snapshot.ref.getDownloadURL()
                  await songsCollection.add(song)
                  if (index === uploadSongs.length - 1) {
                    resolve()
                  }
                } catch (error) {
                  console.log('catch_error => ', error)
                  return
                }
              }
            )
          })
        })
      }
    },

    async submitHandler() {
      this.showLoading = true
      this.albumEditTemp.albumSingerImg =
        (await this.imageHandler('singerImg')) || this.albumEditTemp.albumSingerImg
      this.albumEditTemp.albumImg =
        (await this.imageHandler('albumImg')) || this.albumEditTemp.albumImg
      await this.updateAlbumData()
      await this.updateSongData()
      await this.storeToSong()
      await this.deleteSongFromStorage()
      window.location.reload()
    },

    deleteNewSong(index) {
      if (this.uploadsNesSongs.length < 1) {
        return
      }
      this.uploadsNesSongs.splice(index, 1)
    },

    formatIndex: helper.formatIndex,
    formatSongName: helper.formatSongName
  },
  watch: {
    isClose() {
      if (!this.isClose) {
        this.deleteAlbumSongs = []
        this.uploadsNesSongs = []
      }
    }
  }
}
</script>
<template>
  <Loading :isShow="showLoading"></Loading>
  <toastMessage :toggle="toggle" :message="message" :success="false"></toastMessage>
  <div class="md:order-2 flex-1 rounded border border-gray-200/70 px-3">
    <div class="px-1 pt-6 pb-3 font-bold border-b border-gray-200 flex justify-between">
      <span class="card-title">已上傳的歌曲</span>
      <i class="fa fa-upload float-right text-rose-400 text-xl"></i>
    </div>
    <div class="mt-3">
      <div
        v-for="(song, index) in albumEditTemp.albumSongs"
        :key="index"
        class="border border-zinc-200 p-2 mb-4 rounded font-bold text-sm"
      >
        <div class="flex items-center justify-between">
          <div class="overflow-hidden flex items-center">
            <i></i>
            <p class="pl-2 truncate">{{ formatIndex(index) }}. {{ song.modified_name }}</p>
          </div>
          <div class="">
            <button
              class="ml-1 py-1 px-2 text-sm rounded text-white bg-rose-600"
              @click.prevent="deleteAlbumSong(song.url, song.docID, index)"
            >
              <i class="fa fa-times"></i>
            </button>
          </div>
        </div>
      </div>
      <div
        v-for="(uploadsNesSong, index) in uploadsNesSongs"
        :key="uploadsNesSong.lastModified"
        class="border border-zinc-200 p-2 mb-4 rounded text-sm"
      >
        <div class="flex items-center justify-between">
          <div class="overflow-hidden flex items-center">
            <span class="text-rose-500 italic">new</span>
            <p class="pl-2 truncate">{{ formatSongName(uploadsNesSong.name) }}</p>
          </div>
          <div class="">
            <button
              class="ml-1 py-1 px-2 text-sm rounded text-white bg-rose-600"
              @click.prevent="deleteNewSong(index)"
            >
              <i class="fa fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center mb-3">
        <label class="cursor-pointer">
          <input type="file" class="hidden" multiple @change="addNewSong($event)" />
          <i class="fas fa-plus-square text-rose-500 text-3xl md:text-2xl"></i>
        </label>
        <button
          type="button"
          class="w-auto py-1 px-3 rounded text-zinc-100 bg-rose-500 w-30 hover:bg-rose-600 disabled:bg-zinc-700 disabled:text-zinc-400"
          @click="submitHandler"
        >
          確定修改
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
