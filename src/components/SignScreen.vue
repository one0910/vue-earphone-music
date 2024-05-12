<script>
import { mapState, mapWritableState } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useModalStore } from '@/stores/modal'
export default {
  data() {
    return {
      isCloseScreen: false
    }
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    ...mapWritableState(useModalStore, ['isOpen', 'tab']),
    screen() {
      if (this.isCloseScreen) {
        return 'transform: translate(-100%, 0%);'
      } else {
        return 'transform: translate(0%, 0%);'
      }
    }
  },
  methods: {
    closeScreen() {
      this.isCloseScreen = true
      this.$route.meta.requireScreen = false
    },
    toggleAuthModal() {
      this.isCloseScreen = true
      this.$route.meta.requireScreen = false
      this.isOpen = !this.isOpen
      this.tab = 'register'
    }
  },
  mounted() {
    if (!this.$route.meta.requireScreen) {
      this.$refs.sign_in_wrapper.style.display = 'none'
    }
    if (!this.userLoggedIn) {
      this.isCloseScreen = false
    } else {
      this.isCloseScreen = true
      this.$refs.sign_in_wrapper.style.display = 'none'
    }
  }
}
</script>
<template>
  <div ref="sign_in_wrapper" class="sign_in_wrapper" :style="screen">
    <div class="blurBackground"></div>
    <i class="fas fa-times" @click.prevent="closeScreen"></i>
    <div class="container">
      <div class="signInfoBox">
        <div href="#" class="get168Btn cursor-pointer" @click.prevent="toggleAuthModal">
          註冊成為歌手
        </div>
        <div href="#" class="get168Btn cursor-pointer" @click.prevent="closeScreen">逛逛網站</div>
      </div>
    </div>
    <ul class="bg-bubbles">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@keyframes square {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-1200px) rotate(600deg);
  }
}

.sign_in_wrapper {
  position: fixed;
  background: linear-gradient(to bottom right, #030004 0%, rgb(71 3 28 / 97%) 100%);
  left: 0;
  top: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 30;
  color: #fff;
  transition: all 0.6s;

  /* display: none; */
}

.sign_in_wrapper .fa-times {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 34px;
  color: #eee;
  z-index: 30;
  img {
    max-width: 12%;
    margin: 19px;
  }
}

@media screen and (max-width: 768px) {
  .sign_in_wrapper img {
    max-width: 35%;
    margin: 19px;
  }
}

.container {
  color: #fff;
  width: 300px;
  height: 200px;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  overflow: hidden;
  transition: all 0.5s;
}
.container h2 {
  color: #fff;
  font-size: 40px;
  transition-duration: 1s;
  transition-timing-function: ease-in-put;
  font-weight: 500;
}

.get168Btn {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: 0;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background-color: rgba(255, 255, 255, 0.2);
  width: 250px;
  border-radius: 3px;
  padding: 10px 15px;
  margin: 20px auto 10px auto;
  display: block;
  text-align: center;
  font-size: 18px;
  color: white;
  transition-duration: 0.25s;
  font-weight: 300;
  text-decoration: none;
  position: relative;
  z-index: 2;
}

.bg-bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  /* filter: blur(23px); */
}
.bg-bubbles li {
  position: absolute;
  list-style: none;
  display: block;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.15);
  bottom: -80px;
  animation: square 20s infinite;
  transition-timing-function: linear;
  text-align: center;
  border-radius: 80px;
}
.bg-bubbles li::after {
  content: '♫';
  color: rgba(255, 255, 255, 0.4);
}
.bg-bubbles li:nth-child(1) {
  left: 10%;
  line-height: 40px;
  font-size: 20px;
  background-color: rgba(0, 255, 255, 0.25);
}
.bg-bubbles li:nth-child(2) {
  left: 20%;
  width: 80px;
  height: 80px;
  line-height: 80px;
  font-size: 50px;
  animation-delay: 2s;
  animation-duration: 17s;
  background-color: rgba(255, 0, 255, 0.15);
}
.bg-bubbles li:nth-child(3) {
  left: 25%;
  font-size: 20px;
  line-height: 40px;
  -webkit-animation-delay: 4s;
  animation-delay: 4s;
  background-color: rgba(255, 255, 0, 0.133);
}
.bg-bubbles li:nth-child(4) {
  left: 40%;
  width: 60px;
  height: 60px;
  line-height: 60px;
  font-size: 39px;
  -webkit-animation-duration: 22s;
  animation-duration: 22s;
  background-color: rgba(255, 255, 255, 0.25);
}
.bg-bubbles li:nth-child(5) {
  left: 70%;
  line-height: 40px;
  background-color: rgba(0, 0, 255, 0.15);
}

.bg-bubbles li:nth-child(6) {
  /*left: 80%;*/
  left: 73%;
  width: 120px;
  height: 120px;
  line-height: 120px;
  font-size: 70px;
  -webkit-animation-delay: 3s;
  animation-delay: 3s;
  background-color: rgba(255, 232, 172, 0.223);
}
.bg-bubbles li:nth-child(7) {
  left: 32%;
  width: 160px;
  height: 160px;
  line-height: 160px;
  font-size: 100px;
  font-size: 70px;
  animation-delay: 2s;
  background-color: rgba(123, 237, 136, 0.223);
}

.bg-bubbles li:nth-child(8) {
  left: 55%;
  width: 20px;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  animation-delay: 15s;
  animation-duration: 40s;
  background-color: rgba(251, 124, 202, 0.181);
}

.bg-bubbles li:nth-child(9) {
  left: 25%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  animation-delay: 1s;
  animation-duration: 20s;
  background-color: rgba(36, 195, 248, 0.223);
}
.bg-bubbles li:nth-child(10) {
  /*left: 90%;*/
  left: 60%;
  width: 160px;
  height: 160px;
  line-height: 160px;
  font-size: 100px;
  animation-delay: 11s;
  background-color: rgba(251, 124, 202, 0.223);
}

.bg-bubbles li:nth-child(11) {
  left: 0%;
  width: 160px;
  height: 160px;
  line-height: 160px;
  font-size: 100px;
  -webkit-animation-delay: 8s;
  animation-delay: 8s;
  background-color: rgba(255, 118, 118, 0.223);
}

.bg-bubbles li:nth-child(12) {
  left: 40%;
  width: 60px;
  height: 60px;
  line-height: 60px;
  font-size: 39px;
  -webkit-animation-duration: 25s;
  animation-duration: 25s;
  background-color: rgba(255, 0, 4, 0.15);
}
</style>
