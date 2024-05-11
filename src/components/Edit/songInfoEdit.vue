<script>
import { mapWritableState } from 'pinia'
import { useAlbumInfoStore } from '@/stores/albumInfo'
import helper from '@/includes/helper'
import ToastMessage from '@/components/Alert/toastMessage.vue'
import CropperImag from '@/components/Upload/CropperImag.vue'
export default {
  data() {
    return {
      toggle: false,
      message: '',
      tempCropperFile: {},
      uploadSignerImgTempUrl: '',
      uploadAlbumImgTempUrl: '',
      uploadSchema: {
        albumSinger: 'required',
        albumName: 'required',
        albumGenre: 'required',
        albumDesc: 'required|min:3'
      },
      userData: {
        albumGenre: 'America'
      }
    }
  },
  props: ['isClose'],
  components: {
    ToastMessage,
    CropperImag
  },
  computed: {
    ...mapWritableState(useAlbumInfoStore, ['albumEditTemp'])
  },
  methods: {
    async uploadSignerImg($event) {
      const { file, showAlert, message } = await helper.uploadImg($event)
      if (showAlert) {
        this.toggle = !this.toggle
        this.message = message
        return
      }
      this.tempCropperFile = { file, imageType: 'signer' }
    },
    async uploadAlbumImg($event) {
      const { file, showAlert, message } = await helper.uploadImg($event)
      if (showAlert) {
        this.toggle = !this.toggle
        this.message = message
        return
      }
      this.tempCropperFile = { file, imageType: 'album' }
    },
    isCloseCropper(setClose = {}) {
      console.log('setClose => ', setClose)
      const { isClose, file, imgUrl, imgType } = setClose
      if (imgType === 'signer') {
        this.uploadSignerImgTempUrl = imgUrl
        this.albumEditTemp.albumUploadSingnerImgFile = file
      } else if (imgType === 'album') {
        this.uploadAlbumImgTempUrl = imgUrl
        this.albumEditTemp.albumUploadAlbumImgFile = file
      }
      if (isClose) {
        this.tempCropperFile = {}
      }
    }
  },
  watch: {
    isClose() {
      if (!this.isClose) {
        this.uploadSignerImgTempUrl = ''
        this.uploadAlbumImgTempUrl = ''
      }
    }
  }
}
</script>

<template>
  <ToastMessage :toggle="toggle" :message="message" :success="false"></ToastMessage>
  <CropperImag
    v-if="tempCropperFile['file']"
    :tempCropperFile="tempCropperFile"
    @isCloseCropper="isCloseCropper"
  ></CropperImag>
  <div class="md:order-1 md:w-[50%] w-full rounded border border-gray-200/70 px-3">
    <div class="px-1 pt-6 pb-3 font-bold border-b border-gray-200 flex justify-between">
      <span class="card-title">專輯資訊</span>
      <i class="fa fa-music float-right text-rose-400 text-xl"></i>
    </div>
    <div class="flex justify-between gap-5 mt-3">
      <label
        class="relative flex justify-center w-64 px-1 py-1 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-00 hover:text-white hover:bg-rose-500/40 hover:border-rose-500 hover:border-solid"
      >
        <input type="file" class="hidden" @change="uploadSignerImg($event)" />
        <img
          :src="uploadSignerImgTempUrl ? uploadSignerImgTempUrl : albumEditTemp.albumSingerImg"
          alt=""
        />
        <h6 class="absolute top-1 left-2 text-rose-500">歌手照片</h6>
      </label>
      <label
        class="relative flex justify-center w-64 px-1 py-1 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-00 hover:text-white hover:bg-rose-500/40 hover:border-rose-500 hover:border-solid"
      >
        <input type="file" class="hidden" @change="uploadAlbumImg($event)" />
        <img :src="uploadAlbumImgTempUrl ? uploadAlbumImgTempUrl : albumEditTemp.albumImg" alt="" />
        <h6 class="absolute top-1 left-2 text-rose-500">專輯封面</h6>
      </label>
    </div>
    <!----------------------分隔線 ------------------------>
    <div class="my-4 border-b-[1.5px] border-zinc-500"></div>

    <div class="flex justify-start pl-1">
      <label class="inline-flex items-center mb-3 cursor-pointer">
        <span class="mr-5">是否發佈 :</span>
        <input
          type="checkbox"
          v-model="albumEditTemp.isRelease"
          class="sr-only peer"
          @change="updateRelease"
        />
        <div
          class="relative w-9 h-5 bg-white/20 border-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 dark:peer-focus:ring-rose-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-rose-200 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-rose-500"
        ></div>
        <span v-if="albumEditTemp.isRelease" class="pl-2 text-emerald-500">
          發佈
          <i class="fas fa-check-circle"></i>
        </span>
        <span v-else class="pl-2 text-rose-600">
          不發佈
          <i class="fas fa-bell"></i>
        </span>
      </label>
    </div>
    <vee-form :validation-schema="uploadSchema" v-bind:initial-values="userData">
      <div class="flex gap-2 items-center mb-3">
        <label class="w-20">歌手名稱 :</label>
        <vee-field
          type="text"
          name="albumSinger"
          class="flex-1 py-1.5 px-3 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="歌手名稱"
          v-model="albumEditTemp.albumSinger"
        />
        <ErrorMessage class="text-pink-600" name="albumSinger" />
      </div>
      <div class="flex gap-2 items-center mb-3">
        <label class="w-20">專輯名稱 :</label>
        <vee-field
          type="text"
          name="albumName"
          class="flex-1 py-1.5 px-3 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="專輯名稱"
          v-model="albumEditTemp.albumName"
        />
        <ErrorMessage class="text-pink-600" name="albumName" />
      </div>
      <div class="flex gap-2 items-center mb-3">
        <label class="w-20">專輯類型 :</label>
        <vee-field
          as="select"
          name="albumGenre"
          class="flex-1 h-10 max-w-[75%] md:max-w-full truncate px-3 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          v-model="albumEditTemp.albumGenre"
        >
          <option class="bg-gray-700 text-zinc-100" value="Acoustic">原音樂 Acoustic</option>
          <option class="bg-gray-700 text-zinc-100" value="Blues">藍調 Blues</option>
          <option class="bg-gray-700 text-zinc-100" value="Classical">古典 Classical</option>
          <option class="bg-gray-700 text-zinc-100" value="Country">鄉村音樂 Country</option>
          <option class="bg-gray-700 text-zinc-100" value="Dance">
            電子舞曲 Dance / Electronica
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Drones">持續音 Drones</option>
          <option class="bg-gray-700 text-zinc-100" value="Dubstep">迴響貝斯 Dubstep</option>
          <option class="bg-gray-700 text-zinc-100" value="Easy Listening">
            輕音樂 Easy Listening
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Folk">民歌 Folk</option>
          <option class="bg-gray-700 text-zinc-100" value="Funk">放克 Funk</option>
          <option class="bg-gray-700 text-zinc-100" value="Hip Hop">嘻哈 Hip Hop</option>
          <option class="bg-gray-700 text-zinc-100" value="House">浩室 House</option>
          <option class="bg-gray-700 text-zinc-100" value="Kitsch">俗氣 Kitsch</option>
          <option class="bg-gray-700 text-zinc-100" value="Latin">拉丁 Latin</option>
          <option class="bg-gray-700 text-zinc-100" value="March">進行曲 March</option>
          <option class="bg-gray-700 text-zinc-100" value="Metal">金屬 Metal</option>
          <option class="bg-gray-700 text-zinc-100" value="Opera">歌劇 Opera</option>
          <option class="bg-gray-700 text-zinc-100" value="Pop">流行曲 Pop</option>
          <option class="bg-gray-700 text-zinc-100" value="Rock">搖滾 Rock</option>
          <option class="bg-gray-700 text-zinc-100" value="Soul">騷靈 Soul</option>
          <option class="bg-gray-700 text-zinc-100" value="Urban / R&B">
            都市 / 節奏藍調 Urban / R&Bl
          </option>
          <option class="bg-gray-700 text-zinc-100" value="World Music">
            民俗音樂 World Music
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Other">其他 Other</option>
        </vee-field>
        <ErrorMessage class="text-red-600" name="albumGenre" />
      </div>
      <div class="flex gap-2 items-center mb-3">
        <label class="w-20">歌手自介 :</label>
        <vee-field
          as="textarea"
          name="albumSingerDesc"
          class="flex-1 py-1.5 px-3 h-20 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="歌手自介"
          v-model="albumEditTemp.albumSingerDesc"
        />
        <ErrorMessage class="text-pink-600" name="albumSingerDesc" />
      </div>
      <div class="flex gap-2 items-center mb-3">
        <label class="w-20">專輯簡介 :</label>
        <vee-field
          as="textarea"
          name="albumDesc"
          class="flex-1 py-1.5 px-3 h-20 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="專輯簡介"
          v-model="albumEditTemp.albumDesc"
        />
        <ErrorMessage class="text-pink-600" name="albumDesc" />
      </div>
    </vee-form>
  </div>
</template>

<style lang="scss" scoped></style>
