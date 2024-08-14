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
      <span class="card-title">{{ $t('memberMamagePage.editAlbum.album_info') }}</span>
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
        <h6 class="absolute top-1 left-2 text-rose-500">{{ $t('makeAlbumPage.singer_photo') }}</h6>
      </label>
      <label
        class="relative flex justify-center w-64 px-1 py-1 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-00 hover:text-white hover:bg-rose-500/40 hover:border-rose-500 hover:border-solid"
      >
        <input type="file" class="hidden" @change="uploadAlbumImg($event)" />
        <img :src="uploadAlbumImgTempUrl ? uploadAlbumImgTempUrl : albumEditTemp.albumImg" alt="" />
        <h6 class="absolute top-1 left-2 text-rose-500">{{ $t('makeAlbumPage.album_cover') }}</h6>
      </label>
    </div>
    <!----------------------分隔線 ------------------------>
    <div class="my-4 border-b-[1.5px] border-zinc-500"></div>

    <div class="flex justify-start pl-1">
      <label class="inline-flex items-center mb-3 cursor-pointer">
        <span class="mr-5 truncate"
          >{{ $t('memberMamagePage.editAlbum.make_album_public') }} :</span
        >
        <input
          type="checkbox"
          v-model="albumEditTemp.isRelease"
          class="sr-only peer"
          @change="updateRelease"
        />
        <div
          class="relative w-9 h-5 bg-white/20 border-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 dark:peer-focus:ring-rose-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-rose-200 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-rose-500"
        ></div>
        <span v-if="albumEditTemp.isRelease" class="truncate pl-2 text-emerald-500">
          {{ $t('memberMamagePage.editAlbum.album_is_public') }}
          <i class="fas fa-check-circle"></i>
        </span>
        <span v-else class="truncate pl-2 text-rose-600">
          {{ $t('memberMamagePage.editAlbum.album_is_private') }}
          <i class="fas fa-bell"></i>
        </span>
      </label>
    </div>
    <vee-form :validation-schema="uploadSchema" v-bind:initial-values="userData">
      <div class="flex gap-2 items-center mb-3">
        <label
          :class="{
            'w-20': $i18n.locale === 'zh',
            'w-28': $i18n.locale === 'en',
            truncate: $i18n.locale === 'en'
          }"
          >{{ $t('memberMamagePage.editAlbum.singer_name') }} :</label
        >
        <vee-field
          type="text"
          name="albumSinger"
          class="flex-1 py-1.5 px-3 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('memberMamagePage.editAlbum.singer_name')"
          v-model="albumEditTemp.albumSinger"
        />
      </div>
      <div class="text-left">
        <ErrorMessage class="text-pink-600" name="albumSinger" />
      </div>
      <div class="flex gap-2 items-center mb-3">
        <label
          :class="{
            'w-20': $i18n.locale === 'zh',
            'w-28': $i18n.locale === 'en',
            truncate: $i18n.locale === 'en'
          }"
          >{{ $t('memberMamagePage.editAlbum.album_name') }} :</label
        >
        <vee-field
          type="text"
          name="albumName"
          class="flex-1 py-1.5 px-3 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('memberMamagePage.editAlbum.album_name')"
          v-model="albumEditTemp.albumName"
        />
      </div>
      <div class="text-left">
        <ErrorMessage class="text-pink-600" name="albumName" />
      </div>
      <div class="flex gap-2 items-center mb-3">
        <label
          :class="{
            'w-20': $i18n.locale === 'zh',
            'w-28': $i18n.locale === 'en',
            truncate: $i18n.locale === 'en'
          }"
          >{{ $t('memberMamagePage.editAlbum.album_genre') }} :</label
        >
        <vee-field
          as="select"
          name="albumGenre"
          class="flex-1 h-10 max-w-[75%] md:max-w-full truncate px-3 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          v-model="albumEditTemp.albumGenre"
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
      </div>
      <div class="text-left">
        <ErrorMessage class="text-pink-600" name="albumGenre" />
      </div>
      <div class="flex gap-2 items-center mb-3">
        <label
          :class="{
            'w-20': $i18n.locale === 'zh',
            'w-28': $i18n.locale === 'en',
            truncate: $i18n.locale === 'en'
          }"
          >{{ $t('memberMamagePage.editAlbum.singer_desc') }} :</label
        >
        <vee-field
          as="textarea"
          name="albumSingerDesc"
          class="flex-1 py-1.5 px-3 h-20 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('memberMamagePage.editAlbum.singer_desc')"
          v-model="albumEditTemp.albumSingerDesc"
        />
      </div>
      <div class="text-left">
        <ErrorMessage class="text-pink-600" name="albumSingerDesc" />
      </div>
      <div class="flex gap-2 items-center mb-3">
        <label
          :class="{
            'w-20': $i18n.locale === 'zh',
            'w-28': $i18n.locale === 'en',
            truncate: $i18n.locale === 'en'
          }"
          >{{ $t('memberMamagePage.editAlbum.album_desc') }} :</label
        >
        <vee-field
          as="textarea"
          name="albumDesc"
          class="flex-1 py-1.5 px-3 h-20 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('memberMamagePage.editAlbum.album_desc')"
          v-model="albumEditTemp.albumDesc"
        />
      </div>
      <div class="text-left">
        <ErrorMessage class="text-pink-600" name="albumDesc" />
      </div>
    </vee-form>
  </div>
</template>

<style lang="scss" scoped></style>
