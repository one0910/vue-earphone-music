import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    isOpen: false,
    tab: 'login'
  }),
  getters: {
    hiddenClass(state) {
      return !state.isOpen ? "hidden" : ""
    }
  }
})