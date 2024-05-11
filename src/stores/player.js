import { defineStore } from 'pinia'
import { Howl } from 'howler'
import helper from '@/includes/helper'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    songList: [],
    current_song: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    playProgress: '0% ',
    playingIndex: 0,
    pauseCurrentSong: {}
  }),
  actions: {
    async newSong(song) {
      /*透過instanceof的功能來確認所定義的sound狀態是否為Howl這個實例，
      若是則代表我們正在播放同樣的音樂，則可以用howler的unload功能來重新播放音樂*/
      if (this.sound instanceof Howl) {
        /*upload()功能是howler用來重新播放目前在播放的音樂，
        它的實際作法是暫停目前音樂，然後將該音樂的實例從記憶體上刪除(從記憶體上刪除也可以防止memory leaking的問題)
        從記憶體上刪除該播放音樂的實例後，重新再建立一次該音樂的實例，因此這也是為何會再重新播放音樂
        */
        this.sound.unload()
      }

      this.current_song = song
      this.sound = new Howl({
        src: [song.url],
        /*html5設置為true時，howl會強制使用html5的audio，Html5 audio的優點是不必等到整個音樂檔都都loaad完，就可播放，
        也不必在播放前先解碼，可以邊播邊解碼，html5通常用來播放較大的音樂檔
        */
        html5: true,
        volume: 0.3,
      })

      this.sound.play()

      this.sound.on('play', () => {
        this.progress()
        requestAnimationFrame(this.progress)
      })
    },

    async toggleAudio() {
      if (!this.sound.playing) {
        return
      }

      if (this.sound.playing()) {
        this.sound.pause();
        this.pauseCurrentSong = { pause: true, currentSong: this.current_song.modified_name }
      } else {
        this.pauseCurrentSong = { pause: false, currentSong: this.current_song.modified_name }
        this.sound.play()
      }
    },

    forward_backPlay(isforward) {
      if (!this.sound.playing) {
        return
      }

      if (this.sound.playing()) {
        this.sound.stop()
      }

      if (isforward && this.playingIndex <= this.songList.length - 2) {
        this.playingIndex += 1
      } else if (isforward && this.playingIndex === this.songList.length - 1) {
        this.playingIndex = 0
      } else if (!isforward && this.playingIndex > 0) {
        this.playingIndex -= 1
      } else if (!isforward && this.playingIndex === 0) {
        this.playingIndex = this.songList.length - 1
      }

      this.sound = new Howl({
        src: [this.songList[this.playingIndex]['url']],
        html5: true,
        volume: 0.3,
      })
      this.sound.play()
      this.sound.on('play', () => {
        this.progress()
        requestAnimationFrame(this.progress)
      })
      this.current_song = this.songList[this.playingIndex]
    },
    deleteSong(index) {
      if (this.sound.playing) {
        this.sound.stop()
      }

      this.songList.splice(index, 1)
      if (this.songList.length === 0) {
        this.current_song = {}
      } else {
        this.current_song = this.songList[0]
      }

    },

    progress() {
      this.seek = helper.formatTime(this.sound.seek())
      this.duration = helper.formatTime(this.sound.duration())
      this.playProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`

      /*由於requestAnimationFrame()只能執行一次，而我們需要歌曲的已播放時間這樣不斷更新時間的資料
        因此可以用this.sound.playing()的方式來持續監聽歌曲是否有在播放中，若是有的話再次的去執行requestAnimationFrame()
      */
      if (this.sound.playing()) {
        requestAnimationFrame(this.progress)
      }
    },
    updateSeek(event) {
      // console.log('event.currentTarget => ', event.currentTarget)
      if (!this.sound.playing) {
        return
      }
      /*由於音樂播放的進度音樂條的記算較為複雜，請搭配"同音樂條的寬度及座標計算.jpg"連同下面的說明一起對照觀看
        該音樂條元素的event，透過getBoundingClientRect()可以取得該元素的相對於視窗的相關座標，如下所示，我們要取得x及width
        x:整個視窗從最左邊0到該元素的水平座標
        width:它就是該元素的offsetWidth寬度，就是該元表包含border的整個寬度
        event.clientX:它是點擊擊元素後，可以取得的相對座標，也就是整個視窗從最左邊到被點擊到該元素位置間的水平座標
      */

      const { x, width } = event.currentTarget.getBoundingClientRect()
      const clickX = event.clientX - x
      const percentage = clickX / width
      const seconds = this.sound.duration() * percentage
      this.sound.seek(seconds)
      this.sound.once('seek', this.progress)

    }
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing()
      }
      return false
    },
  },
})