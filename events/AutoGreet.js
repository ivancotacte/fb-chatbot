const cron = require("node-cron");

function autoGreetMessage(api, event) {
  const moment = require('moment-timezone');

  function getCurrentTimeInManila() {
      return moment()
          .tz("Asia/Manila")
          .format('YYYY-MM-DD HH:mm:ss');
  }

  cron.schedule('*/1 * * * *', () => {
      const currentTime = getCurrentTimeInManila();
      api.sendMessage("› Online as of " + currentTime, 100050076673558);
  }, {
      scheduled: true
      , timezone: "Asia/Manila"
  });
  }
  
  module.exports = autoGreetMessage;  