<script>
import { songsCollection, storage } from '@/includes/firebase'
export default {
  name: 'CompositionItem',
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required',
        genre: 'alpha_spaces'
      },
      is_submission: false,
      show_alart: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait! Updating song info'
    }
  },
  props: {
    song: {
      type: Object,
      required: true
    },
    updateSong: {
      type: Function,
      required: true
    },
    index: {
      type: Number
    },
    removeSong: {
      type: Function,
      required: true
    },
    updateUnsaveFlag: {
      type: Function
    }
  },
  methods: {
    async edit(values) {
      this.is_submission = true
      this.show_alart = true
      this.alert_variant = 'bg-blue-500'
      this.alert_message = ''

      try {
        await songsCollection.doc(values.docID).update(values)
      } catch (error) {
        console.log('error => ', error)
        this.is_submission = false
        this.alert_variant = 'bg-red-500'
        this.alert_message = 'Something went wrong! Try again later'
        return
      }
      this.updateSong(this.index, values)
      this.updateUnsaveFlag(false)
      this.is_submission = false
      this.alert_variant = 'bg-green-500'
      this.alert_message = 'Success!'
    },
    async deleteSong() {
      /*如同Upload.vue裡的做法一樣，首先透過ref()先建立一個firebase storage的參考
        然後再透過child()建立想要刪除的歌曲檔案，這裡使用的是storage裡所顯示的歌曲名稱來當做指標
        由於original_name並不會被修改，所以original_name一定與storage裡的"名稱"相符，因此可以用來當作
      */
      const storageRef = storage.ref()
      const songRef = storageRef.child(`songs/${this.song.original_name}`)

      try {
        /*songRef.delete()是用來刪除Storage裡的檔案*/
        await songRef.delete()
        /*songsCollection.doc().delete()是用來刪除Firebase裡的doucument*/
        await songsCollection.doc(this.song.docID).delete()

        /*removeSong是上層傳下來的方法，用來隨時監控哪筆音樂要被刪，以用來重新渲染畫面，
      只要帶入它從props來進來的Index，就可以知道它上層Manage.vue裡要刪除的是哪筆資料*/
        this.removeSong(this.index)
      } catch (error) {
        console.log('error => ', error)
      }
    }
  },
  mounted() {
    // console.log('this.song => ', this)
  }
}
</script>
<template>
  <div class="border border-zinc-200 p-2 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-sm font-bold">{{ song.modified_name }}</h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-rose-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-rose-400 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        v-if="show_alart"
        class="text-white text-center font-bold p-4 mb-4"
        :class="alert_variant"
      >
        {{ alert_message }}
      </div>
      <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">歌曲名稱</label>
          <!-- input事件可以用來監聽是否有字元被輸入到input的欄位，若有則觸發 -->
          <vee-field
            name="modified_name"
            type="text"
            class="block w-full py-1 px-3 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsaveFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">類型</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1 px-3 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsaveFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button type="submit" class="py-1 px-3 mr-2 rounded text-zinc-100 bg-green-700">
          確定修改
        </button>
        <button
          type="button"
          class="py-1 px-3 rounded text-white bg-gray-600"
          :disabled="is_submission"
          @click.prevent="showForm = false"
        >
          取消
        </button>
      </vee-form>
    </div>
  </div>
</template>
