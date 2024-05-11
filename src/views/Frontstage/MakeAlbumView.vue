<script>
import UploadImageMakeAlbum from '@/components/Upload/UploadImage-MakeAlbum.vue'
import UploadSongMakeAlbum from '@/components/Upload/UploadSong-MakeAlbum.vue'
export default {
  components: {
    UploadImageMakeAlbum,
    UploadSongMakeAlbum
  }
}
</script>
<template>
  <main class="text-zinc-200 bg-zinc-900 mt-[55px] pt-[10px] pb-[10px] mb-[90px] relative">
    <section class="container mx-auto pt-1 pr-1 md:pr-0">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
          <div class="bg-zinc-900 rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-5 pb-3 font-bold border-b border-gray-200">
              <span class="card-title">開始製作專輯</span>
              <i class="fa fa-music float-right text-rose-400 text-xl"></i>
            </div>
            <UploadImageMakeAlbum></UploadImageMakeAlbum>
          </div>
        </div>
        <div class="col-span-2 mt-3 md:mt-0">
          <div class="bg-zinc-900 rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-5 pb-3 font-bold border-b border-gray-200">
              <span class="card-title">您要上傳的歌曲</span>
              <i class="fa fa-upload float-right text-rose-400 text-xl"></i>
            </div>
            <UploadSongMakeAlbum></UploadSongMakeAlbum>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
.custom-file-upload {
  border: 1px solid #ccc;
  display: flex;
  padding: 6px 12px;
  cursor: pointer;
  width: 100%;
  height: 200px;
}
</style>
