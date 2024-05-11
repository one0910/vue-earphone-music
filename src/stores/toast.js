import { defineStore } from "pinia";
export const useToastStore = defineStore("toast", {
  state: () => ({
    toastCount: 0,
  }),
  actions: {
    subtractToastCount() {
      if (this.toastCount > 0) {
        this.toastCount -= 1
      }
    },
  }
})