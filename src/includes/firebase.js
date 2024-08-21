import firebase from "firebase/app"
import "firebase/auth"
import 'firebase/firestore'
import 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyDifpf4NnX-S7J890trgdqn9o1GZ2rd8Y0",
  authDomain: "vue-developer-course---music.firebaseapp.com",
  projectId: "vue-developer-course---music",
  storageBucket: "vue-developer-course---music.appspot.com",
  // messagingSenderId: "842258481263",
  appId: "1:842258481263:web:599be2573872ab20c94d9a"
};

// console.log('setDoc => ', setDoc)
firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

/*啟用firebase的離線存取功能*/
db.enablePersistence().catch((error) => {
  console.log(`Firebase persistence error ${error.code}`);
});

const userCollection = db.collection('users')
const songsCollection = db.collection('songs')
const albumsCollection = db.collection('albums')
const favoriteSongListCollection = db.collection('favoriteSongList')

export {
  firebase,
  auth,
  db,
  userCollection,
  songsCollection,
  albumsCollection,
  favoriteSongListCollection,
  storage
}