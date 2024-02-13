const login = require("./includes/fb-chat-api");
const fs = require("fs");
const Server = require("@igorkowalczyk/repl-uptime");

async function Listen(cb) {
  login(
    { appState: JSON.parse(fs.readFileSync("appstate.json", "utf8")) },
    async (err, api) => {
      require("./events/AutoGreet")({ api });
      try {
        if (err) return console.error(err);
        api.setOptions({
          logLevel: "silent",
          forceLogin: true,
          listenEvents: true,
          autoMarkDelivery: true,
          autoMarkRead: true,
          selfListen: false,
          online: true,
          proxy: process.env.PROXY,
        });
        api.listenMqtt((err, event) => {
          if (err) return console.error(err);
          cb(api, event);
        });
      } catch (err) {
        if (!!err.errorSummary) {
          console.log(err.errorSummary);
        } else {}
      }
    },
  );
}

new Server({
  port: 8080,
  path: "/",
  message: "🤙 Don't let your repl go to sleep!",
  debug: true,
});

module.exports = { Listen };