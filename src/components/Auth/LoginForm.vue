<script>
import { mapActions } from 'pinia'
import { useUserStore } from '@/stores/user'
export default {
  name: 'loginForm',
  data() {
    return {
      tab: 'login',
      loginSchema: {
        email: 'required|email',
        password: 'required|min:9|max:100|excluded:password'
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: 'bg-blue-500/50',
      login_alert_msg: '正在登入中.'
    }
  },
  methods: {
    ...mapActions(useUserStore, ['authenticate']),
    async login(values) {
      this.login_in_submission = true
      this.login_show_alert = true
      this.login_alert_variant = 'bg-blue-500/50'
      this.login_alert_msg = '正在登入中.'

      try {
        await this.authenticate(values)
      } catch (error) {
        console.log('error => ', error)
        this.login_in_submission = false
        this.login_alert_variant = 'bg-red-500'
        this.login_alert_msg = '登入失敗.'
        return
      }

      this.login_alert_variant = 'bg-green-500/60'
      this.login_alert_msg = '登入成功! 轉跳頁面中.'
      console.log('this.$route => ', this.$route)
      window.location.reload()
    }
  }
}
</script>

<template>
  <!-- Login Form -->
  <div
    class="text-white text-center font-bold p-2 rounded mb-4"
    v-if="login_show_alert"
    :class="login_alert_variant"
  >
    {{ login_alert_msg }}
  </div>
  <vee-form :validation-schema="loginSchema" v-on:submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        name="email"
        type="email"
        autocomplete="email"
        class="block w-full py-1.5 px-3 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-pink-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">密碼</label>
      <vee-field
        type="password"
        name="password"
        autocomplete="current-password"
        class="block w-full py-1.5 px-3 bg-white/10 text-zinc-100 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-pink-600" name="password" />
    </div>
    <button
      type="submit"
      class="block w-full bg-pink-500/75 text-white py-1.5 px-3 rounded transition hover:bg-pink-500/55 disabled:bg-gray-400"
      :disabled="login_in_submission"
    >
      傳送
    </button>
  </vee-form>
</template>

<style lang="scss" scoped></style>
