const withNext = require('next')

module.exports = withNext({
  server: {
    port: 3002,
    open: true,
  },
})
