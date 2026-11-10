const withNext = require('next')

module.exports = withNext({
  server: {
    port: 3003,  // Changed from 3002 to avoid conflict with frontend on :3002
    open: true,
  },
})