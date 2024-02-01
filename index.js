const login = require('./fb-chat-api')
const Server = require("@igorkowalczyk/repl-uptime");
const dotenv = require('dotenv');
const fs = require("fs");
const log = require("npmlog");
const config = require("./config");
dotenv.config();

login({ appState: JSON.parse(fs.readFileSync("appstate.json", "utf8")) }, (err, api) => {
  if (err) return console.error(err);
  api.setOptions({
    logLevel: "silent",
    forceLogin: true,
    listenEvents: true,
    autoMarkDelivery: false,
    selfListen: true,
    proxy: process.env.PROXY,
  });

  api.listenMqtt(async (err, event) => {
    if (err) return log.error(err);

    require('./custom')({ api });
    switch (event.type) {
      case "message":
      case "message_reply":
        require("./handlers/handleMessage.js")({ api, event, config });
        break;
      case "event":
        console.log(event);
        break;
    }
  });
});

new Server({
  port: 8080,
  path: "/",
  message: "🤙 Don't let your repl go to sleep!",
  debug: true,
});