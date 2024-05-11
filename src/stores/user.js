import { defineStore } from "pinia";
import { auth, userCollection, favoriteSongListCollection } from "@/includes/firebase";

export const useUserStore = defineStore("user", {
  state: () => ({
    userLoggedIn: false,
    userName: '',
    uid: '',
    favSongList: []
  }),
  actions: {
    async register(values) {
      /*先確認firebase裡的authentication裡的email是否已經存在了，目的是為了確認是否已經登入firebase了*/
      const userCredential = await auth.createUserWithEmailAndPassword(values.email, values.password)

      /*寫入將表單填寫的註冊資料寫入資料庫，
        方法一:使用add的寫法，但無法指定document的ID
        方法二所以改用.doc.set()的寫法，可以指定document的ID
      */
      // await userCollection.add({
      await userCollection.doc(userCredential.user.uid).set({
        name: values.name,
        email: values.email,
      })
      await userCredential.user.updateProfile({
        displayName: values.name
      })

      await favoriteSongListCollection.doc(userCredential.user.uid).set({
        favSongLists: [],
      })

      this.userLoggedIn = true
    },
    async authenticate(values) {
      const user = await auth.signInWithEmailAndPassword(values.email, values.password)
      this.userLoggedIn = true
    },
    async signOut() {
      await auth.signOut()
      this.userLoggedIn = false
      this.userName = ''
      this.uid = ''
      this.favSongList = []
    },
    async delfavSongFromList(docID) {
      try {
        const favoriteSongListRef = favoriteSongListCollection.doc(this.uid)
        console.log(' favoriteSongListRef=> ', favoriteSongListRef)
      } catch (error) {
        console.log('error => ', error)
      }
    }
  }
})