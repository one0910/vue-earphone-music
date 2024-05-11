import { defineStore } from "pinia";



export const useAlertConfirmStore = defineStore("alert", {
  state: () => ({
    isShowAlertConfirm: false,
    alertMessage: '',
    delFavSong: {
      index: null,
      docID: ''
    },
    delData: false,
    deleteData: {}

  }),
  actions: {
    fireShowAlertConfirm(del) {
      const { data, msg } = del
      this.isShowAlertConfirm = true
      this.deleteData = (data) ? data : {}
      this.alertMessage = (msg) ? msg : ''
    },
    closeAlert() {
      this.isShowAlertConfirm = false
      this.delFavSong = {
        index: null,
        docID: ''
      }
      this.deleteData = {}
      this.alertMessage = ''
    },

    delDataCheck() {
      this.isShowAlertConfirm = false
      this.delData = true
    }
  }
})