const plugin = require("tailwindcss/plugin");

const animationDelay = plugin(function ({ matchUtilities, theme }) {
  /*這裡將tailwind plugin裡matchUtilities及theme建構出來
   -matchUtilities的功能 : 可以自行加入tailwind utilites的CSS樣式
   -theme的功能: 可以用來加入或是修改所註冊的CSS名稱的預設值，以此為例，我們可以為新註冊的animation-delay透過theme來設置一組預設的值
  
  */
  matchUtilities({
    /*這裡註冊一個animation-delay的名稱，它會被放在html的class裡當做tailwind的CSS來選用
      而下面的引數value，則是由自定義[]裡的數值傳送來的，例如:若是在html的CSS class使用animation-delay-[150ms]
      則傳送來的value則為150ms
    */
    'animation-delay': (value) => {
      /*這裡回傳的是一個物件，物件裡面可以放CSS屬性，如下所示，它回傳的是CSS的動畫屬性animation-delay
        但這裡要注意的是tailwind要求回傳的CSS屬性寫法需要改為camel case(駝峰式命名)寫法
        例如屬性background-color，則需改寫為backgroundColor
      */
      return {
        'animationDelay': value,
      }
    }
  }, {
    /*這裡放的是matchUtilities功能裡的第二組參數，可以用來放所定義的預設值，有二種寫法
     - 第一種寫法: 透過theme來將定義的預設定帶進matchUtilities
     而這裡的theme與下面的theme是不一樣的，這裡的theme是plugin裡所回呼函式所解構出來的theme，
     裡面放的參數就是我們在下面所定義的預設組名稱，如下所示，下面定義了一組名為animationDelay的預設組包*/
    values: theme('animationDelay')

    /*- 第二種寫法: 直接將預設值定義到values裡，如下所示，我個人認為用第二種寫法應該會比較好懂*/
    // values: {100: '100ms',200: '200ms',300: '300ms',400: '400ms',500: '500ms',600: '600ms',}
  })
}, {
  /*這裡是tailwind plugin放的第二組參數的地方，根據tailwind pluging在這裡有提供一個屬性theme
  可以用來定義預設值，如下所示，我們透過屬性theme來定義一組預設的值給所註冊的animation-delay來使用
  另外這裡的theme與上面plugin裡回呼函式所解構的theme是不一樣的
  */
  theme: {
    /*所以在此theme的物件裡，就可以自定義一組預設值來套用在所註冊的自定義tailwind CSS名稱上，
    如下所示，我們定義組名為animationDelay(這裡的屬性名稱可以隨意命名)的預設組包
    */
    'animationDelay': {
      /*這裡用來定義數值*/
      100: '100ms',
      200: '200ms',
      300: '300ms',
      400: '400ms',
      500: '500ms',
      600: '600ms',
      700: '700ms',
      900: '800ms',
      900: '900ms',
      1000: '1000ms',
    }
  }
})

module.exports = animationDelay