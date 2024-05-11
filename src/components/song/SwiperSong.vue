<script>
import { albumsCollection } from '@/includes/firebase'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import { mapWritableState, mapState } from 'pinia'
import { useAlbumInfoStore } from '@/stores/albumInfo'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

export default {
  data() {
    return {
      modules: [Navigation],
      albums: [],
      isfundraising: false
    }
  },
  props: {
    gener: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(useAlbumInfoStore, ['albumInfo']),
    ...mapWritableState(useAlbumInfoStore, ['albumInfo'])
  },
  methods: {
    async getAlbums() {
      const genre = this.gener.toLowerCase()
      try {
        const docSnapshot = await albumsCollection.doc(genre).get()
        let items = docSnapshot.data().items
        if (items.length === 0) {
          return
        }
        if (genre === 'fundraising') {
          let filterItem = items
            .sort((a, b) => b.createdAt - a.createdAt)
            .filter((item) => item.isRelease === true)
          this.albums = filterItem
          this.isfundraising = true
        } else {
          this.albums = items
        }
      } catch (error) {
        console.error('Error adding album:', error)
      }
    },
    setAlbumInfo(album) {
      this.albumInfo = album
    }
  },
  components: {
    Swiper,
    SwiperSlide,
    albumsCollection
  },
  beforeMount() {
    this.getAlbums()
  }
}
</script>
<template>
  <div class="mt-3">
    <swiper
      :slidesPerView="2.5"
      :spaceBetween="10"
      :navigation="true"
      :modules="modules"
      :breakpoints="{
        768: {
          slidesPerView: 7.5,
          spaceBetween: 20
        }
      }"
    >
      <swiper-slide v-for="(album, index) in albums" :key="index">
        <router-link
          :to="{
            name: 'album',
            params: { gener: gener.toLowerCase(), albumSinger: album.albumSinger }
          }"
        >
          <img
            :src="album.isRelease ? album.albumSingerImg : album.albumImg"
            alt=""
            @click="setAlbumInfo(album)"
            :class="{ 'rounded-full': isfundraising, ' rounded-md': !isfundraising }"
          />
          <p
            class="text-sm my-1 font-bold text-zinc-200 w-[130px] truncate overflow-hidden text-center mx-auto"
            :class="{ hidden: isfundraising }"
          >
            《{{ album.albumName }}》
          </p>
          <p class="text-sm font-bold text-zinc-200" :class="{ 'mt-2': isfundraising }">
            {{ album.albumSinger }}
          </p>
        </router-link>
      </swiper-slide>
    </swiper>
  </div>
</template>

<style>
.swiper-button-prev:after {
  content: '\f100';
  font-family: 'Font Awesome 5 free';
  color: #ff75adc7;
  font-weight: 600;
  font-size: 2rem;
}
.swiper-button-next:after {
  content: '\f101';
  font-family: 'Font Awesome 5 free';
  color: #ff75adc7;
  font-weight: 600;
  font-size: 2rem;
}
.swiper-button-prev.swiper-button-disabled,
.swiper-button-next.swiper-button-disabled {
  opacity: 0;
}
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  max-width: 100%;
  height: auto;
  object-fit: cover;
}
</style>
@/stores/albumInfo
