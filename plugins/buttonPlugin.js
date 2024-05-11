const plugin = require("tailwindcss/plugin");
const { default: lightOrDarkColor } = require("@check-light-or-dark/color");

const buttonPlugin = plugin(function ({ addComponents, matchComponents, theme }) {
  /*addComponents是tailwind外掛提供的客制化元件的功能，其中這個theme它是tailwind它所定義的所有utilities CSS都包含在裡面
    如下所示可以透過theme裡的樣式與自定義元件裡的樣式做搭配
  */
  addComponents({
    '.btn': {
      display: 'inline-block',
      cursor: 'prointer',
      fontWeight: 'bold',
      /*第一種寫法*/
      // padding: `${theme('space')['2']} ${theme('space')['4']}`,
      /*第二種寫法*/
      padding: `${theme('space.2')} ${theme('space.4')}`,
      borderRadius: theme('borderRadius')['lg'],
    }
  })

  /*下面這個是一很強大的功能，利用key in的方式將theme裡的某個定義好的樣式iterate出來
    如下所示，今天我們可以想要將theme裡的所有的color樣式全部加到我們自定義的.btn裡
  */
  for (let key in theme('colors')) {
    if (typeof theme('colors')[key] !== 'string') {
      for (let shade in theme('colors')[key]) {
        const colorType = lightOrDarkColor(theme("colors")[key][shade]);
        addComponents({
          [`.btn-${key}-${shade}`]: {
            backgroundColor: theme('colors')[key][shade],
            color: colorType === "dark" ? "white" : "black",
          }
        })

      }
    }
  }

  /*matchComponents如同在animationDelay.js檔案裡提的，它的主要作用就有2個
  第一個:自定義並註冊元件名稱到tailwind裡，其實跟addComponents差不多
  第二個:它可以在html的class裡，帶參數進來，讓樣式可以更彈性的運用，如下所示，vaule就是它callback function從html帶過來的數值
  
  */
  matchComponents({
    'btn': (value) => {
      console.log('value => ', value)
      return {
        backgroundColor: value,
        color: lightOrDarkColor(value) === "dark" ? "white" : "black",
      }
    }
  })
})

module.exports = buttonPlugin