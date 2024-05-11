<script>
import { mapActions, mapState } from 'pinia'
import { useAlertConfirmStore } from '@/stores/alertConfirm'
export default {
  computed: {
    ...mapState(useAlertConfirmStore, ['isShowAlertConfirm', 'alertMessage'])
  },
  methods: {
    ...mapActions(useAlertConfirmStore, ['fireShowAlertConfirm', 'closeAlert', 'delDataCheck'])
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
    :class="{ hidden: !isShowAlertConfirm }"
  >
    <div class="relative top-[120px] md:m-auto w-full max-w-sm h-auto">
      <!-- Modal content -->
      <div class="relative py-4 text-center bg-zinc-800/90 rounded-lg shadow dark:bg-gray-800">
        <!-- 視窗右上角關閉按照 X -->
        <button
          type="button"
          class="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-toggle="deleteModal"
          @click.prevent="closeAlert()"
        >
          <svg
            aria-hidden="true"
            class="w-5 h-5"
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
          <span class="sr-only">Close modal</span>
        </button>

        <!-- 視窗上面垃圾桶圖標 -->
        <svg
          class="text-gray-400 dark:text-gray-500 w-7 h-7 mb-1 mx-auto"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <!-- alert視窗的內容 -->
        <div class="flex items-center justify-around pt-2 py-5">
          <p class="flex-1 text-gray-300 dark:text-gray-300 text-center">
            {{ alertMessage }}
          </p>
        </div>
        <div class="flex justify-center items-center space-x-4">
          <button
            data-modal-toggle="deleteModal"
            type="button"
            class="py-2 px-3 text-sm font-medium text-zinc-200 bg-black/10 rounded-lg border border-gray-500 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            @click.prevent="closeAlert()"
          >
            取消
          </button>
          <button
            type="submit"
            class="py-2 px-3 text-sm font-medium text-center text-white bg-rose-600/80 rounded-lg hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500/ dark:hover:bg-red-600 dark:focus:ring-red-900"
            @click.prevent="delDataCheck()"
          >
            確定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
