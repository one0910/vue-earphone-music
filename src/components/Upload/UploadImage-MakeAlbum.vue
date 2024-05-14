<script>
import { useAlbumInfoStore } from '@/stores/albumInfo'
import { mapWritableState } from 'pinia'
import CropperImag from '@/components/Upload/CropperImag.vue'
import ToastMessage from '@/components/Alert/toastMessage.vue'
import helper from '@/includes/helper'
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
  components: {
    ToastMessage,
    CropperImag
  },
  computed: {
    ...mapWritableState(useAlbumInfoStore, ['albumMakeTemp'])
  },
  methods: {
    uploadSubmit(value) {},

    uploadImg($event) {
      return new Promise((resolve, reject) => {
        const file = $event.target.files[0]
        if (!file) {
          return
        }
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp']
        if (!validTypes.includes(file.type)) {
          this.toggle = !this.toggle
          this.message = `請上傳圖片檔，如jpg、png、bmp檔等`
          reject(new Error('Invalid file type.'))
          return
        }

        const imgUrl = URL.createObjectURL(file)
        const img = new Image()
        img.src = imgUrl
        img.onload = () => {
          const width = img.naturalWidth
          const height = img.naturalHeight

          if (width !== height) {
            this.toggle = !this.toggle
            this.message = `建議圖片為長、寬一樣的尺寸，例如500x500`
            reject(new Error('Invalid image dimensions.'))
            return
          } else if (width < 200 && height < 200) {
            this.toggle = !this.toggle
            this.message = `圖片尺寸長、寬需大於200像素`
            reject(new Error('Invalid image dimensions.'))
            return
          } else {
            resolve({ file, imgUrl })
          }
        }
      })
    },

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
        this.albumMakeTemp.albumUploadSingnerImgFile = file
      } else if (imgType === 'album') {
        this.uploadAlbumImgTempUrl = imgUrl
        this.albumMakeTemp.albumUploadAlbumImgFile = file
      }
      if (isClose) {
        this.tempCropperFile = {}
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
  <div class="p-6">
    <div class="flex justify-between gap-2">
      <label
        class="relative flex justify-center w-64 px-1 py-1 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-00 hover:text-white hover:bg-rose-500/40 hover:border-rose-500 hover:border-solid"
        :class="{ 'px-10': !uploadSignerImgTempUrl, 'md:py-20 py-10': !uploadSignerImgTempUrl }"
      >
        <input type="file" class="hidden" @change="uploadSignerImg($event)" />
        <h6 class="mx-auto" v-if="!uploadSignerImgTempUrl">上傳歌手照片</h6>
        <img v-else :src="uploadSignerImgTempUrl" alt="" />
        <h6 v-show="uploadSignerImgTempUrl" class="absolute top-1 left-2 text-rose-500">
          歌手照片
        </h6>
      </label>
      <label
        class="relative flex justify-center w-64 px-1 py-1 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-00 hover:text-white hover:bg-rose-500/40 hover:border-rose-500 hover:border-solid"
        :class="{ 'px-10': !uploadAlbumImgTempUrl, 'md:py-20 py-10': !uploadAlbumImgTempUrl }"
      >
        <input type="file" class="hidden" @change="uploadAlbumImg($event)" />
        <h6 class="mx-auto" v-if="!uploadAlbumImgTempUrl">上傳專輯封面</h6>
        <img v-else :src="uploadAlbumImgTempUrl" alt="" />
        <h6 v-show="uploadAlbumImgTempUrl" class="absolute top-1 left-2 text-rose-500">專輯封面</h6>
      </label>
    </div>

    <hr class="my-6" />

    <!-- 歌手表單 -->
    <vee-form :validation-schema="uploadSchema" v-bind:initial-values="userData">
      <div>
        <label class="inline-block mb-2">歌手名稱</label>
        <vee-field
          type="text"
          name="albumSinger"
          class="block w-full py-1.5 px-3 mb-4 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="歌手名稱"
          v-model="albumMakeTemp.albumSinger"
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
          v-model="albumMakeTemp.albumName"
        />
        <ErrorMessage class="text-pink-600" name="albumName" />
      </div>
      <div>
        <label class="inline-block mb-2">專輯類型</label>
        <vee-field
          as="select"
          name="albumGenre"
          class="block h-10 w-full truncate px-3 mb-4 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          v-model="albumMakeTemp.albumGenre"
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
      <div>
        <label class="inline-block mb-2">專輯描述</label>
        <vee-field
          as="textarea"
          name="albumDesc"
          class="block w-full h-24 py-1.5 px-3 mb-4 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="請描述您的專輯"
          v-model="albumMakeTemp.albumDesc"
        />
        <ErrorMessage class="text-pink-600" name="albumDesc" />
      </div>
      <div>
        <label class="inline-block mb-2">歌手描述</label>
        <vee-field
          as="textarea"
          name="albumSingerDesc"
          class="block w-full h-24 py-1.5 px-3 mb-4 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="請描述您自己"
          v-model="albumMakeTemp.albumSingerDesc"
        />
        <ErrorMessage class="text-pink-600" name="albumSingerDesc" />
      </div>
    </vee-form>
  </div>
</template>

<style lang="scss" scoped></style>
