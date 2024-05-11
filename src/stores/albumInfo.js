import { defineStore } from 'pinia'

export const useAlbumInfoStore = defineStore('albumInfo', {
  state: () => ({
    albumInfo: {},
    albumMakeTemp: {
      albumID: '',
      albumDesc: '',
      albumImg: '',
      albumName: '',
      albumSinger: '',
      albumSingerDesc: '',
      albumSingerImg: '',
      albumGenre: 'Acoustic',
      albumUploadSingnerImgFile: {},
      albumUploadAlbumImgFile: {},
    },
    albumEditTemp: {
      isLoading: false,
      isRelease: false,
      albumID: '',
      albumDesc: '',
      albumImg: '',
      albumName: '',
      albumSinger: '',
      albumSingerDesc: '',
      albumSingerImg: '',
      albumGenre: '',
      albumSongs: [],
      albumUploadSingnerImgFile: {},
      albumUploadAlbumImgFile: {},
    }
  }),
  actions: {
    initalbumMakeTemp() {
      this.albumMakeTemp.albumDesc = ''
      this.albumMakeTemp.albumID = ''
      this.albumMakeTemp.albumGenre = 'Acoustic'
      this.albumMakeTemp.albumImg = ''
      this.albumMakeTemp.albumName = ''
      this.albumMakeTemp.albumDesc = ''
      this.albumMakeTemp.albumSingerDesc = ''
      this.albumMakeTemp.albumUploadSingnerImgFile = {}
      this.albumMakeTemp.albumUploadAlbumImgFile = {}
    },
    initalbumEditTemp() {
      this.albumEditTemp.isLoading = false
      this.albumEditTemp.albumDesc = ''
      this.albumEditTemp.albumSinger = ''
      this.albumEditTemp.albumID = ''
      this.albumEditTemp.albumGenre = ''
      this.albumEditTemp.albumImg = ''
      this.albumEditTemp.albumName = ''
      this.albumEditTemp.albumDesc = ''
      this.albumEditTemp.albumSingerDesc = ''
      this.albumEditTemp.albumSingerImg = ''
      this.albumEditTemp.isRelease = false
      this.albumEditTemp.albumSongs = []
      this.albumEditTemp.albumUploadSingnerImgFile = {}
      this.albumEditTemp.albumUploadAlbumImgFile = {}
    }
  }
})