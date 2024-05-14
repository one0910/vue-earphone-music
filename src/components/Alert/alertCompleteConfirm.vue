<script>
import { mapState, mapWritableState, mapActions } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useAlbumInfoStore } from '@/stores/albumInfo'
import { albumsCollection } from '@/includes/firebase'
export default {
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapState(useUserStore, ['uid']),
    ...mapWritableState(useAlbumInfoStore, ['albumMakeTemp'])
  },
  methods: {
    ...mapActions(useAlbumInfoStore, ['initalbumMakeTemp']),
    async releaseToPublic() {
      const { albumID } = this.albumMakeTemp
      const albumRef = albumsCollection.doc('fundraising')
      const albumRefDoc = await albumRef.get()

      try {
        /*確定將專輯發布後，先去更新已存到database裡專屬的album fundraising isRelease屬性為treu*/
        const albumDocRef = albumRef.collection(this.uid).doc(albumID)
        await albumDocRef.update({
          isRelease: true
        })

        /*再來將album fundraising裡的items做更新，一樣是將該albumID的isRelease屬性更新為treu*/
        if (albumRefDoc.exists) {
          let items = albumRefDoc.data().items
          items.forEach((item) => {
            if (item.albumID === albumID) {
              item.isRelease = true
            }
            return item
          })
          await albumRef.update({ items })
        }

        const albumSinger = this.albumMakeTemp.albumSinger
        /*再來將Store裡的資料重新初始化*/
        this.initalbumMakeTemp()
        /*最後前往專輯頁看自己的專輯*/
        this.$router.push({
          name: 'album',
          params: { gener: 'fundraising', albumSinger }
        })
      } catch (error) {
        console.log('error => ', error)
      }
    },
    goToHome() {
      this.initalbumMakeTemp()
      this.$router.push({
        name: 'home'
      })
    }
  }
}
</script>
<template>
  <!-- Main modal -->
  <div
    id="deleteModal"
    tabindex="-1"
    aria-hidden="true"
    class="overflow-y-auto overflow-x-hidden fixed top-0 bg-gray-900/50 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal h-full px-3 md:px-0"
    :class="{ hidden: !isShow }"
  >
    <div class="relative top-[120px] md:m-auto w-full max-w-sm h-auto">
      <!-- Modal content -->
      <div class="relative py-4 text-center bg-zinc-800/90 rounded-lg shadow dark:bg-gray-800">
        <!-- 視窗上面的打勾符號 -->
        <svg
          class="text-green-400 w-7 h-7 mb-1 mx-auto"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
          />
        </svg>
        <!-- alert視窗的內容 -->
        <div class="flex items-center justify-around pt-2 py-5">
          <p class="flex-1 text-gray-300 dark:text-gray-300 text-center">
            {{ '專輯已完成，是否要公開至網站上? ' }}
          </p>
        </div>
        <div class="flex justify-center items-center space-x-4">
          <button
            data-modal-toggle="deleteModal"
            type="button"
            class="py-2 px-3 text-sm font-medium text-zinc-200 bg-black/10 rounded-lg border border-gray-500 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            @click.prevent="goToHome()"
          >
            目前先不用
          </button>
          <button
            type="submit"
            class="py-2 px-3 text-sm font-medium text-center text-white bg-green-500/80 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500/ dark:hover:bg-red-600 dark:focus:ring-red-900"
            @click.prevent="releaseToPublic()"
          >
            是
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
