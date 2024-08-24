<script>
import { mapState, mapActions, mapWritableState } from 'pinia'
import { useAlbumInfoStore } from '@/stores/albumInfo'
import { usePlayerStore } from '@/stores/player'
import { useToastStore } from '@/stores/toast'
import { songsCollection, albumsCollection } from '@/includes/firebase'
import {
  transSingerDesc,
  transAlbumDesc,
  transSingerName,
  transAlbumName,
  transSingerName_fund,
  transSingerDesc_fund,
  transAlbumName_fund,
  transAlbumDesc_fund
} from '@/helper/transform.language'
import SongItem from '@/components/song/SongItem.vue'
import helper from '@/includes/helper'
import memberImage from '@/assets/images/logo.png'

export default {
  data() {
    return {
      isPlaying: false,
      songs: [],
      memberImage
    }
  },
  components: {
    SongItem
  },
  computed: {
    ...mapState(usePlayerStore, ['albumPageImgClass']),
    ...mapWritableState(useAlbumInfoStore, ['albumInfo']),
    ...mapWritableState(usePlayerStore, ['songList']),
    ...mapWritableState(useToastStore, ['toastCount']),
    albumSingerImg() {
      if (this.albumInfo.albumSingerImg) {
        return this.albumInfo.albumSingerImg
      } else {
        return 'https://i.imgur.com/arYdJI6.png'
      }
    },
    signerName() {
      const { albumSinger, type, temp } = this.albumInfo
      if (type === 'member_fundraising') {
        return transSingerName_fund(albumSinger, type, temp)
      } else {
        return transSingerName(albumSinger)
      }
    },
    signerDescription() {
      const { albumSinger, albumSingerDesc, type, temp } = this.albumInfo
      if (type === 'member_fundraising') {
        return transSingerDesc_fund(albumSinger, albumSingerDesc, type, temp)
      } else {
        return transSingerDesc(albumSinger, albumSingerDesc)
      }
    },
    albumName() {
      const { albumName, type, temp } = this.albumInfo
      if (type === 'member_fundraising') {
        return transAlbumName_fund(albumName, type, temp)
      } else {
        return transAlbumName(albumName)
      }
    },
    albumDescription() {
      const { albumName, albumDesc, type, temp } = this.albumInfo
      if (type === 'member_fundraising') {
        return transAlbumDesc_fund(albumName, albumDesc, type, temp)
      } else {
        return transAlbumDesc(albumName, albumDesc)
      }
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong']),
    async getAlbumSongs() {
      try {
        const Snapshot = await songsCollection
          .where('display_name', '==', this.$route.params.albumSinger)
          .get()

        Snapshot.forEach((document, index) => {
          this.songs.push({
            ...document.data(),
            docID: document.id
          })
        })
      } catch (error) {
        console.log('getAlbumSongs error => ', error)
      }
    },
    palySong() {
      this.newSong(this.songList[0])
      this.isPlaying = true
    },
    formatIndex: helper.formatIndex
  },
  async mounted() {
    await this.getAlbumSongs()
    this.songList = this.songs
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    this.toastCount = 0
  },

  /*本來fetch albums data是要在beforeMount的生命週期去執岑，現在改放到 beforeRouteEnter路由層級來做
  裡是為了要測試其perceived performance的效果
  */
  async beforeRouteEnter(to, from, next) {
    try {
      const Snapshot = await albumsCollection.doc(to.params.gener).get()
      next((vm) => {
        const albumData = Snapshot.data().items.filter((item) => {
          return item.albumSinger === vm.$route.params.albumSinger
        })
        vm.albumInfo = {
          ...albumData[0]
        }
      })
    } catch (error) {}
  }
}
</script>
<template>
  <main class="text-zinc-200 bg-zinc-900 pb-8 mt-[63px] mb-[90px]" id="albumPage">
    <div class="max-w-[1200px] mx-auto pt-10">
      <div class="flex md:flex-row flex-col">
        <!-- 左側邊歌手介紹 -->
        <div class="md:order-1 order-last w-[25%] hidden md:block sidebarBackgound">
          <div class="max-w-[160px] mx-auto">
            <img class="rounded-full" :src="albumSingerImg" alt="" />
          </div>
          <div class="text-center mt-6 px-5">
            <p class="text-lg">{{ $t('singer') }}</p>
            <p class="text-2xl pb-3">{{ signerName }}</p>
            <p class="text-zinc-400 text-left">
              {{ signerDescription }}
            </p>
          </div>
        </div>

        <!-- 右側邊專輯 -->
        <div class="md:order-2 flex-1 px-3 md:px-14">
          <div class="md:flex items-center border-b-2 border-[#e6dbdb21] pb-4">
            <div class="flex md:flex-row flex-col justify-center">
              <div class="mx-auto" :class="albumPageImgClass" @click.prevent="palySong">
                <img :src="albumInfo.albumImg" alt="" />
              </div>
              <div class="md:ml-10 md:mt-5 text-center md:text-left">
                <p class="text-[25px] tracking-widest leading-loose text-white">
                  {{ albumName }}
                </p>
                <p class="md:pb-5">{{ signerName }}</p>
                <p class="md:block hidden max-w-80">
                  {{ albumDescription }}
                </p>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <ul class="px-2 md:px-0">
              <li
                class="flex py-3 items-center"
                v-for="(song, index) in songs"
                :key="song.coverImg"
              >
                <p
                  class="flex-none w-7 md:w-24 text-[12px] md:text-base md:leading-normal leading-6"
                >
                  {{ formatIndex(index) }}.
                </p>
                <SongItem :songData="song" :index="index"></SongItem>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.sidebarBackgound {
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 20%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.1) 60%,
    rgba(255, 255, 255, 0) 100%
  );
}
</style>
