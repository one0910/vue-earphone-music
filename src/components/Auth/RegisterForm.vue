<script>
import { mapActions } from 'pinia'
import { useUserStore } from '@/stores/user'
const excluded = 'password,admin'
export default {
  name: 'registerForm',
  data() {
    return {
      schema: {
        name: 'required|min:3|max:100',
        email: 'required|min:3|max:100|email',
        password: `required|min:9|max:100|excluded:${excluded}`,
        confirm_password: 'passwords_mismatch:@password'
      },
      userData: {
        country: 'USA'
      },
      reg_in_submission: false,
      res_show_alert: false,
      reg_alert_variant: 'bg-blue-500/50',
      reg_alert_msg: '註冊中，請稍等...'
    }
  },
  computed: {},
  methods: {
    ...mapActions(useUserStore, {
      createUser: 'register'
    }),
    /*按下註冊鈕時*/
    async register(values) {
      this.res_show_alert = true
      this.reg_in_submission = true
      this.reg_alert_variant = 'bg-blue-500/50'
      this.reg_alert_msg = '註冊中，請稍等...'
      try {
        /*若註冊成功時*/
        await this.createUser(values)
      } catch (error) {
        /*若註冊失敗*/
        this.reg_in_submission = false
        this.reg_alert_variant = 'bg-red-500/60'
        this.reg_alert_msg = error.message
        console.log('error => ', error)
        return
      }
      this.reg_alert_variant = 'bg-green-500/60'
      this.login_alert_msg = '註冊成功! 轉跳頁面中.'
      window.location.reload()
    }
  }
}
</script>

<template>
  <!-- Registration Form -->
  <div
    class="text-white text-center font-bold p-2 rounded mb-4"
    v-if="res_show_alert"
    :class="reg_alert_variant"
  >
    {{ reg_alert_msg }}
  </div>
  <!-- 在vee-form裡可以綁定initial-values的屬性，設定input的預設值，
            如下所示，它需要帶入一個物件，如userData， 該物件需裡的key要對應vee-field裡的欄位-->
  <vee-form :validation-schema="schema" @submit="register" v-bind:initial-values="userData">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">使用者名稱</label>

      <!-- 下面使用vee-field 這個validate套件的標籤取代input，
        並設定一個name的屬性，該屬性的值則為data()=>{return schema: {}}裡面的key，
        以下面為例，該input的name則為data()=>{return schema: {name:}}裡面的name
      -->
      <vee-field
        name="name"
        type="text"
        class="block w-full py-1.5 px-3 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="輸入使用者名稱"
      />
      <!-- ErrorMessage裡的name要與 vee-field所綁定的name是一致的，
                以下面為例，name裡值則為vee-field裡name的值-->
      <ErrorMessage class="text-pink-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="輸入Email"
      />
      <ErrorMessage class="text-pink-600" name="email" />
    </div>

    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">密碼</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          class="block w-full py-1.5 px-3 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          type="password"
          name="password"
          autocomplete="password"
          placeholder="輸入密碼"
          v-bind="field"
        />
        <div class="text-pink-600" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </vee-field>
      <!-- <ErrorMessage class="text-pink-600" name="password" /> -->
    </div>

    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">請再次輸入您的密碼</label>
      <vee-field
        name="confirm_password"
        type="password"
        class="block w-full py-1.5 px-3 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="再次確認密碼"
      />
      <ErrorMessage class="text-pink-600" name="confirm_password" />
    </div>

    <button
      type="submit"
      class="block w-full bg-pink-500/75 text-white py-1.5 px-3 rounded transition hover:bg-pink-500/55 disabled:bg-gray-400"
      :disabled="reg_in_submission"
    >
      送出
    </button>
  </vee-form>
</template>

<style lang="scss" scoped></style>
