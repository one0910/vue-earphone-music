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
          this.message = this.$t('alertMsg.file_extension_check_alert')
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
            this.message = this.$t('')
            reject(new Error('Invalid image dimensions.'))
            return
          } else if (width < 200 && height < 200) {
            this.toggle = !this.toggle
            this.message = this.$t('alertMsg.photo_pixel_than_suggetion_alert')
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
        <h6 class="mx-auto" v-if="!uploadSignerImgTempUrl">
          {{ $t('makeAlbumPage.upload_singer_photo') }}
        </h6>
        <img v-else :src="uploadSignerImgTempUrl" alt="" />
        <h6 v-show="uploadSignerImgTempUrl" class="absolute top-1 left-2 text-rose-500">
          {{ $t('makeAlbumPage.singer_photo') }}
        </h6>
      </label>
      <label
        class="relative flex justify-center w-64 px-1 py-1 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-00 hover:text-white hover:bg-rose-500/40 hover:border-rose-500 hover:border-solid"
        :class="{ 'px-10': !uploadAlbumImgTempUrl, 'md:py-20 py-10': !uploadAlbumImgTempUrl }"
      >
        <input type="file" class="hidden" @change="uploadAlbumImg($event)" />
        <h6 class="mx-auto" v-if="!uploadAlbumImgTempUrl">
          {{ $t('makeAlbumPage.upload_album_cover') }}
        </h6>
        <img v-else :src="uploadAlbumImgTempUrl" alt="" />
        <h6 v-show="uploadAlbumImgTempUrl" class="absolute top-1 left-2 text-rose-500">
          {{ $t('makeAlbumPage.album_cover') }}
        </h6>
      </label>
    </div>

    <hr class="my-6" />

    <!-- 歌手表單 -->
    <vee-form :validation-schema="uploadSchema" v-bind:initial-values="userData">
      <div>
        <label class="inline-block mb-2">{{ $t('makeAlbumPage.singer_name') }}</label>
        <vee-field
          type="text"
          name="albumSinger"
          class="block w-full py-1.5 px-3 mb-4 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('makeAlbumPage.singer_name')"
          v-model="albumMakeTemp.albumSinger"
        />
        <ErrorMessage class="text-pink-600" name="albumSinger" />
      </div>
      <div>
        <label class="inline-block mb-2">{{ $t('makeAlbumPage.album_name') }}</label>
        <vee-field
          type="text"
          name="albumName"
          class="block w-full py-1.5 px-3 mb-4 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('makeAlbumPage.album_name')"
          v-model="albumMakeTemp.albumName"
        />
        <ErrorMessage class="text-pink-600" name="albumName" />
      </div>
      <div>
        <label class="inline-block mb-2">{{ $t('makeAlbumPage.album_genre') }}</label>
        <vee-field
          as="select"
          name="albumGenre"
          class="block h-10 w-full truncate px-3 mb-4 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          v-model="albumMakeTemp.albumGenre"
        >
          <option class="bg-gray-700 text-zinc-100" value="Acoustic">
            {{ $t('makeAlbumPage.albumGenre.Acoustic') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Blues">
            {{ $t('makeAlbumPage.albumGenre.Blues') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Classical">
            {{ $t('makeAlbumPage.albumGenre.Classical') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Country">
            {{ $t('makeAlbumPage.albumGenre.Country') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Dance">
            {{ $t('makeAlbumPage.albumGenre.Dance_Electronica') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Drones">
            {{ $t('makeAlbumPage.albumGenre.Drones') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Dubstep">
            {{ $t('makeAlbumPage.albumGenre.Dubstep') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Easy Listening">
            {{ $t('makeAlbumPage.albumGenre.Easy_Listening') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Folk">
            {{ $t('makeAlbumPage.albumGenre.Folk') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Funk">
            {{ $t('makeAlbumPage.albumGenre.Funk') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Hip Hop">
            {{ $t('makeAlbumPage.albumGenre.Hip_Hop') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="House">
            {{ $t('makeAlbumPage.albumGenre.House') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Kitsch">
            {{ $t('makeAlbumPage.albumGenre.Kitsch') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Latin">
            {{ $t('makeAlbumPage.albumGenre.Latin') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="March">
            {{ $t('makeAlbumPage.albumGenre.March') }}/option>
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Metal">
            {{ $t('makeAlbumPage.albumGenre.Metal') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Opera">
            {{ $t('makeAlbumPage.albumGenre.Opera') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Pop">
            {{ $t('makeAlbumPage.albumGenre.Pop') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Rock">
            {{ $t('makeAlbumPage.albumGenre.Rock') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Soul">
            {{ $t('makeAlbumPage.albumGenre.Soul') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Urban / R&B">
            {{ $t('makeAlbumPage.albumGenre.Urban_R&Bl') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="World Music">
            {{ $t('makeAlbumPage.albumGenre.World_Music') }}
          </option>
          <option class="bg-gray-700 text-zinc-100" value="Other">
            {{ $t('makeAlbumPage.albumGenre.Other') }}
          </option>
        </vee-field>
        <ErrorMessage class="text-red-600" name="albumGenre" />
      </div>
      <div>
        <label class="inline-block mb-2">{{ $t('makeAlbumPage.album_desc') }}</label>
        <vee-field
          as="textarea"
          name="albumDesc"
          class="block w-full h-24 py-1.5 px-3 mb-4 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('makeAlbumPage.descript_your_album')"
          v-model="albumMakeTemp.albumDesc"
        />
        <ErrorMessage class="text-pink-600" name="albumDesc" />
      </div>
      <div>
        <label class="inline-block mb-2">{{ $t('makeAlbumPage.singer_desc') }}</label>
        <vee-field
          as="textarea"
          name="albumSingerDesc"
          class="block w-full h-24 py-1.5 px-3 mb-4 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('makeAlbumPage.descript_yourself')"
          v-model="albumMakeTemp.albumSingerDesc"
        />
        <ErrorMessage class="text-pink-600" name="albumSingerDesc" />
      </div>
    </vee-form>
  </div>
</template>

<style lang="scss" scoped></style>
