<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
export default {
  name: 'CropperImage',
  data() {
    return {
      cropper: null,
      imageSrc: null,
      imageFile: []
    }
  },
  emits: ['isCloseCropper'],
  props: {
    tempCropperFile: {
      type: Object,
      require: true
    }
  },
  methods: {
    initCropper() {
      if (this.cropper) {
        this.cropper.destroy()
      }
      const cropImage = this.$refs.cropImage
      this.cropper = new Cropper(cropImage, {
        aspectRatio: 1,
        preview: '.img-preview',
        viewMode: 1,
        data: {
          x: 0,
          y: 0
        },
        minContainerHeight: 600
      })
    },
    setImage($event) {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(this.tempCropperFile['file']) // 讀取選擇的文件
      fileReader.onload = (event) => {
        // console.log('e.target.result => ', e.target.result)
        this.imageSrc = event.target.result // 更新圖片來源
        this.$nextTick(() => {
          this.initCropper() // 重新初始化 Cropper
        })
      }
    },
    cropAndSave() {
      // 獲取裁切後的 Canvas
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        // 將 Blob 轉換為 File
        const fileName = `cropped_${Date.now()}.jpeg` // 創建一個具有時間戳的文件名
        const file = new File([blob], fileName, { type: 'image/jpeg' })
        const imgUrl = URL.createObjectURL(file)
        this.$emit('isCloseCropper', {
          isClose: true,
          file,
          imgUrl,
          imgType: this.tempCropperFile.imageType
        })
      }, 'image/jpeg')
    },
    closeCropper() {
      this.$emit('isCloseCropper', { isClose: true })
      this.cropper.destroy()
    }
  },
  mounted() {
    this.initCropper()
    this.setImage()
  },
  beforeDestroy() {
    if (this.cropper) {
      this.cropper.destroy()
    }
  }
}
</script>
<template>
  <!-- Main modal -->

  <div
    tabindex="-1"
    aria-hidden="true"
    class="overflow-y-auto overflow-x-hidden fixed top-0 bg-gray-900/90 right-0 left-0 z-40 justify-center items-center w-full md:inset-0 h-modal h-full px-3 md:px-0"
  >
    <div class="relative md:top-[20px] md:m-auto w-full max-w-lg h-auto">
      <!-- Modal content -->
      <div class="relative py-2 text-center bg-zinc-800 rounded-lg shadow dark:bg-gray-800">
        <!-- 視窗右上角關閉按照 X -->
        <button
          type="button"
          class="text-rose-500 absolute top-2.5 right-2.5 z-50 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          @click="closeCropper"
        >
          <svg
            aria-hidden="true"
            class="w-7 h-7"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <div class="mx-2">
          <div class="max-w-lg relative">
            <img ref="cropImage" :src="imageSrc" alt="Source Image" />
            <div class="absolute bottom-0 left-1 docs-preview">
              <div class="img-preview preview-md"></div>
            </div>
          </div>
          <div class="flex justify-center items-center mt-3">
            <div class="w-full">
              <button
                type="button"
                class="w-full ml-1 py-1 rounded text-white bg-rose-600"
                @click="cropAndSave"
              >
                {{ $t('button.confirm_cropper') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.img-preview {
  float: left;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  overflow: hidden;
}

.img-preview > img {
  max-width: 100%;
}

.preview-lg {
  height: 9rem;
  width: 16rem;
}

.preview-md {
  height: 4.5rem;
  width: 8rem;
}

.preview-sm {
  height: 2.25rem;
  width: 4rem;
}

.preview-xs {
  height: 1.125rem;
  margin-right: 0;
  width: 2rem;
}
</style>
