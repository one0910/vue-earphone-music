const plugin = require("tailwindcss/plugin");

const openVariant = plugin(function ({ addVariant }) {
  /*這裡的addVariant使用比較複雜一點，官方文件也寫的很爛，所以可以到課程
  Tailwind CSS - Zero to Hero tailwind css - tailwind v3 2024的2-13(13. Extend tailwind css custom open variant & implement mobile menu functionality)
  該節課的中後面會開始解釋它的用法，所以若是忘了可以到此節課來復習
  */

  /*addVariant裡要帶入2個參數
    第一個:所自定義的前綴group-*，*可以任意命名
    第二個:這裡參數可以想像成是為了設定條件可能會比較好理解，其中':merge'是tailwind所提供的指令(directive)，用來結合.group或.peer的CSS class
    '&'符號與sass scss裡的 '&'的概念有點類似，代表的是目前的元素，而這裡的'&'，則是'group-chagne:'，
    也就是說加了addVariant("group-chagne", ":merge(.group).hamburgerChange &")這一整串後，tailwind就會產生如下的class CSS
    .group.hamburgerChange .group-chagne\:-{} (這一樣整的樣式可以到index.html，將滑鼠游標(hover)停在有'group-chagne:'樣式的地方則可以顯示當前addVariant所產生的樣式)
    這也就是為什麼要透過javascript(在script.js檔裡)去動態的新增'.hamburgerChange，當同層的CSS class裡有group又有hamburgerChange，
    則可以啟動group.hamburgerChange .group-chagne\:-{}裡的style樣式，例如group.hamburgerChange .group-chagne\:top-2{top: 0.5rem}
  */
  addVariant("group-change", ":merge(.group).hamburgerChange &");
  addVariant("group-open", ":merge(.group).displaySubMenu &");
  /*與group不同，group通常是放在父層來使用，搭配的group-*則是放在子層，而
  peer則是與搭配的peer-*則是放在同一層(sibling layer)，所以如同上面的解釋，
  addVariant("peer-open", ":merge(.peer).hamburgerChange ~ &") 這一段的程式碼，
  tailwind則會產生 .peer.hamburgerChange ~ .peer-open\:{}的CSS 樣式
  */
  addVariant("peer-open", ":merge(.peer).hamburgerChange ~ &");
});

module.exports = openVariant;
