import { defineStore } from "pinia";

export const useCommonStore = defineStore("common", {
  state: () => ({
    language: '',
    isMoblieScreen: window.matchMedia('(max-width: 768px)').matches
  }),
  actions: {
    setLanguage(language) {
      this.language = language
    },
    setMoblieScreen(isMobile) {
      this.isMoblieScreen = isMobile
    }
  }
})