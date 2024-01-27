const login = require('./fb-chat-api')
const Server = require("@igorkowalczyk/repl-uptime");
const dotenv = require('dotenv');
dotenv.config();

const local = {
    timezone: "Asia/Manila",
    region: "ph",
    headers: {
      "X-Facebook-Locale": "en_US",
      "X-Facebook-Timezone": "Asia/Manila",
      "X-Fb-Connection-Quality": "EXCELLENT",
    },
  };
login({ appState: process.env.appState , local: local }, (err, api) => {
    if(err) return console.error(err);
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

        switch (event.type) {
            case "message":
                const input = event.body.toLowerCase();
                if (input.startsWith("ping")) {
                    api.sendMessage("Pong!", event.threadID);
                }
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