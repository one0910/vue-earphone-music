const plugin = require("tailwindcss/plugin");

const customizedCSS = plugin(function ({ addUtilities }) {
  addUtilities({
    'caption-bottom': {
      'caption-side': 'bottom'
    },
    'caption-top': {
      'caption-side': 'top'
    },
    '.animation-paused': {
      'animationPlayState': 'paused',
    },
    '.animation-running': {
      'animationPlayState': 'running',
    },
  })
})

module.exports = customizedCSS