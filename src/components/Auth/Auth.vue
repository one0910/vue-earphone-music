<script>
import { mapState, mapWritableState } from 'pinia'
import { useModalStore } from '@/stores/modal'
import LoginForm from '@/components/Auth/LoginForm.vue'
import RegisterForm from '@/components/Auth/RegisterForm.vue'
export default {
  data() {
    return {
      // tab: 'login'
    }
  },
  components: {
    LoginForm,
    RegisterForm
  },
  computed: {
    ...mapState(useModalStore, ['hiddenClass']),
    ...mapWritableState(useModalStore, ['tab']),
    // ...mapWritableState(useModalStore, ['isOpen']) /*透過mapWritableState可以修改store裡的所定義的state*/
    ...mapWritableState(useModalStore, {
      modalVisibility: 'isOpen'
    }) /*這種寫法可以重新命名store裡所定義狀態的屬性名稱，可以避免命名衝突的問題，
    以此為例原本從useModalStore取得的的狀態名稱為isOpne，透過mapWritableState改為modalVisibility*/
  }
}
</script>
<template>
  <div class="fixed z-10 inset-0 overflow-y-auto text-zinc-200" id="modal" :class="hiddenClass">
    <div
      class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="inline-block align-bottom w-full bg-zinc-900/70 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="pt-3 pb-7 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-md font-bold">{{ $t('signin&singup.your_account') }}</p>
            <!-- Modal Close Button -->
            <!-- <div class="modal-close cursor-pointer z-50" @click="isOpen = false"> -->
            <div class="modal-close cursor-pointer z-50" @click="modalVisibility = false">
              <i class="fas fa-times"></i>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                class="block rounded py-1.5 px-2 transition"
                href="#"
                @click.prevent="tab = 'login'"
                v-bind:class="{
                  /*這是vue的寫法，綁定一個動態的class到html tag裡，這個動態的class裡面則放入一個物件，
                  裡面的格式為'class':條件，如下所示，當tab==='login'時，則顯示hover:text-white text-white bg-blue-600的class*/
                  'hover:text-white text-white bg-pink-500/75': tab === 'login',
                  'hover:text-rose-200': tab === 'register'
                }"
                >{{ $t('signin&singup.sign_in') }}</a
              >
            </li>
            <li class="flex-auto text-center">
              <a
                class="block rounded py-1.5 px-2 transition"
                href="#"
                @click.prevent="tab = `register`"
                v-bind:class="{
                  'hover:text-white text-white bg-pink-500/75': tab === 'register',
                  'hover:text-rose-200': tab === 'login'
                }"
                >{{ $t('signin&singup.sign_up') }}</a
              >
            </li>
          </ul>
          <LoginForm v-if="tab === 'login'" />
          <RegisterForm v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
