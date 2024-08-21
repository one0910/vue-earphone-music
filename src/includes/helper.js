import device from 'current-device'
import i18n from './i18n'

export default {
  formatTime(time) {
    const minutes = Math.floor(time / 60) || 0
    /*Math.round((time - minutes * 60)) 可以算出還剩多少秒，(傳送進來的時間)-(分鐘乘上60)，
      例如時間已過75.87秒，則按照這公式=> Math.round(75.87-(1*60))=>15.87的四捨五入=> 那麼得到seconds得到會是16秒
    */
    const seconds = Math.round((time - minutes * 60) || 0)
    /*(seconds < 10) ? '0' : '' 這公式用來過濾超過10的秒數，秒數小於10的，一律顯示0，超過10的則只顯示空字串，其實也就是不顯示*/
    return `${minutes}:${(seconds < 10) ? '0' : ''}${seconds}`
  },
  convertPercentageToNumber(percentageString) {
    if (!percentageString) return 0; // 如果输入为空，返回0
    // 移除字符串中的 '%' 字符并转换为浮点数
    return parseFloat(percentageString.replace('%', ''));
  },
  RangeInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  formatIndex(index) {
    return (index + 1).toString().padStart(2, '0');
  },
  formatSongName(songName) {
    let formattedName = songName.replace('.mp3', '');
    formattedName = formattedName.replace(/^\d+\.\s*/, '');
    return formattedName;
  },
  /*用來調整播放清單的高度*/
  changeHightStyle(favSongList, listRef) {
    const isDesktop = device.desktop()
    const isMobile = device.mobile()

    if (favSongList.length < 8 && isDesktop) {
      listRef.style.height = '418px'
    } else if (favSongList.length < 6 && isMobile) {
      listRef.style.height = '300px'
    } else {
      listRef.style.height = 'auto'
    }
  },
  uploadImg($event) {
    return new Promise((resolve, reject) => {
      const file = $event.target.files[0]

      if (!file) {
        return
      }
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp']
      if (!validTypes.includes(file.type)) {
        resolve({ showAlert: true, message: i18n.global.t("alertMsg.file_extension_check_alert") })
      }
      resolve({ file })

      // const imgUrl = URL.createObjectURL(file)
      // const img = new Image()
      // img.src = imgUrl
      // img.onload = () => {
      //   const width = img.naturalWidth
      //   const height = img.naturalHeight

      //   if (width !== height) {
      //     // reject(new Error('Invalid image dimensions.'))
      //     resolve({ showAlert: true, message: `建議圖片為長、寬一樣的尺寸，例如500x500` })
      //   } else if (width < 200 && height < 200) {
      //     // reject(new Error('Invalid image dimensions.'))
      //     resolve({ showAlert: true, message: `圖片尺寸長、寬需大於200像素` })
      //   } else {
      //     resolve({ file, imgUrl })
      //   }
      // }
    })
  },
}