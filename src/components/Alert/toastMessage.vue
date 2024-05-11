<script>
import { mapWritableState, mapActions, mapState } from 'pinia'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
export default {
  data() {
    return {
      close: false
    }
  },
  props: ['toggle', 'message', 'success'],
  computed: {
    ...mapWritableState(useToastStore, ['toastCount']),
    ...mapState(useUserStore, ['userLoggedIn']),
    topPosition() {
      if (this.toastCount > 0) {
        return `top:${70}px`
      }
    }
  },
  methods: {
    ...mapActions(useToastStore, ['subtractToastCount']),
    closeToast() {
      this.close = false
      this.subtractToastCount()
    }
  },
  watch: {
    toggle() {
      this.close = true
      this.toastCount += 1
    }
  }
}
</script>

<template>
  <div
    id="toast-warning"
    class="flex fixed right-1 z-[12] items-center w-full max-w-xs p-4 text-zinc-200 bg-zinc-800/90 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
    role="alert"
    :style="topPosition"
    :class="{ hidden: !close }"
  >
    <div
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"
      :class="{
        'text-green-500': success,
        'text-rose-500': !userLoggedIn || !success
      }"
    >
      <!-- 打勾符號 -->
      <svg
        v-if="success"
        class="w-6 h-6"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
        />
      </svg>

      <!-- 驚嘆號符號 -->
      <svg
        v-else
        class="w-6 h-6"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
        />
      </svg>
      <span class="sr-only">Warning icon</span>
    </div>
    <div class="ms-3 text-sm font-normal">{{ this.message }}</div>
    <button
      type="button"
      class="ms-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
      data-dismiss-target="#toast-warning"
      aria-label="Close"
      @click.prevent="closeToast"
    >
      <span class="sr-only">Close</span>
      <svg
        class="w-3 h-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
    </button>
  </div>
</template>

<style lang="scss" scoped></style>
