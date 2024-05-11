<script>
import { storage, auth, songsCollection, albumsCollection, firebase } from '@/includes/firebase'
import helper from '@/includes/helper'
import toastMessage from '@/components/Alert/toastMessage.vue'
export default {
  name: 'Upload',
  data() {
    return {
      is_dragover: false,
      uploadsTemp: [],
      uploadSchema: {
        albumName: 'required',
        albumSinger: 'required',
        albumCoverImgUrl: 'required',
        albumGenre: 'required'
      },
      userData: {
        albumGenre: 'America'
      },
      toggle: false,
      message: ''
    }
  },
  props: ['addSong'],
  components: {
    toastMessage
  },
  methods: {
    upload($event) {
      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files]
      console.log('files => ', files)
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
    deleteSong(index) {
      this.uploadsTemp.splice(index, 1)
    },
    uploadSubmit(value) {
      /*開始上傳檔案*/
      this.uploadsTemp.forEach((file, index) => {
        const storageRef = storage.ref()
        const songsRef = storageRef.child(`songs/${file['file'].name}`)

        /*1.先將歌曲上傳到firebase storage*/
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
                album: value.albumName,
                coverImg: value.albumCoverImgUrl,
                uid: auth.currentUser.uid,
                display_name: value.albumSinger,
                original_name: task.snapshot.ref.name,
                modified_name: helper.formatSongName(task.snapshot.ref.name),
                genre: value.albumGenre,
                comment_count: 0
              }
              const album = {
                albumDesc: '',
                albumImg: value.albumCoverImgUrl,
                albumName: value.albumName,
                albumSinger: value.albumSinger,
                albumSingerDesc: '',
                albumSingerImg: ''
              }

              song.url = await task.snapshot.ref.getDownloadURL()

              /*2.取得存放歌曲的url後，再統一將該專輯的song資料寫入到songs的database collection*/
              const songRef = await songsCollection.add(song)
              const songSnapshot = await songRef.get()
              this.addSong(songSnapshot)

              /*3.再來將專輯資料寫入到另一個album的collection*/
              const albumRef = albumsCollection.doc(value.albumGenre.toLowerCase())

              await albumRef.update({
                items: firebase.firestore.FieldValue.arrayUnion(album)
              })
              console.log('Album added successfully')

              /*4.最後的樣式修改 */
              this.uploadsTemp[index].variant = 'bg-green-400'
              this.uploadsTemp[index].icon = 'fa fa-check'
              this.uploadsTemp[index].text_class = 'text-green-400'
              this.uploadsTemp[index].isUploadComplete = true
            } catch (error) {
              console.log('error => ', error)
            }
          }
        )
      })
    },
    formatIndex: helper.formatIndex,
    formatSongName: helper.formatSongName
  }
}
</script>
<template>
  <toastMessage :toggle="toggle" :message="message"></toastMessage>
  <div class="bg-zinc-900 rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-5 pb-3 font-bold border-b border-gray-200">
      <span class="card-title">上傳歌曲</span>
      <i class="fas fa-upload float-right text-rose-500 text-xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-00 hover:text-white hover:bg-rose-500/40 hover:border-rose-500 hover:border-solid"
        :class="{ 'bg-rose-500 border-rose-500 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>請拖曳檔案到此</h5>
      </div>
      <!-- <input type="file" multiple 
      @change="upload($event)" 
      class="mt-3" /> -->

      <input
        class="block w-full text-md borderrounded-lg cursor-pointer text-gray-400 focus:outline-none mt-4"
        type="file"
        multiple
        @change="upload($event)"
      />

      <hr class="my-6" />

      <!-- Progess Bars -->

      <vee-form
        :validation-schema="uploadSchema"
        v-on:submit="uploadSubmit"
        v-bind:initial-values="userData"
      >
        <div>
          <label class="inline-block mb-2">歌手名稱</label>
          <vee-field
            type="text"
            name="albumSinger"
            class="block w-full py-1.5 px-3 mb-4 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="歌手名稱"
          />
          <ErrorMessage class="text-pink-600" name="albumSinger" />
        </div>
        <div>
          <label class="inline-block mb-2">專輯名稱</label>
          <vee-field
            type="text"
            name="albumName"
            class="block w-full py-1.5 px-3 mb-4 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="專輯名稱"
          />
          <ErrorMessage class="text-pink-600" name="albumName" />
        </div>
        <div>
          <label class="inline-block mb-2">專輯類型</label>
          <vee-field
            as="select"
            name="albumGenre"
            class="block w-full py-1.5 px-3 mb-4 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option class="bg-gray-700 text-zinc-100" value="America">America</option>
            <option class="bg-gray-700 text-zinc-100" value="Kpop">Kpop</option>
            <option class="bg-gray-700 text-zinc-100" value="Jpop">Jpop</option>
            <option class="bg-gray-700 text-zinc-100" value="Music">Music</option>
          </vee-field>
          <ErrorMessage class="text-red-600" name="albumGenre" />
        </div>
        <div>
          <label class="inline-block mb-2">專輯封面</label>
          <vee-field
            type="text"
            name="albumCoverImgUrl"
            class="block w-full py-1.5 px-3 mb-4 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="專輯封面"
          />
          <ErrorMessage class="text-pink-600" name="albumCoverImgUrl" />
        </div>

        <p class="mb-3 border-b-2 border-[#fff]/30 pb-2">要上傳的歌曲:</p>
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
        <button
          type="submit"
          class="py-1 px-3 mr-2 rounded text-zinc-100 bg-rose-500 w-full hover:bg-rose-600 disabled:bg-zinc-700 disabled:text-zinc-400"
          :disabled="uploadsTemp.length == 0"
        >
          檔案上傳
        </button>
      </vee-form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
