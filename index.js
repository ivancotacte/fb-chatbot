const login = require('./fb-chat-api');
const Server = require("@igorkowalczyk/repl-uptime");
const dotenv = require('dotenv');
const fs = require("fs");
const path = require("path");
const config = require("./config");
dotenv.config();

function clearCache() {
  const cacheFolderPath = "./cache"; 

  try {
    // Check if the cache folder exists
    if (fs.existsSync(cacheFolderPath)) {
      // Get the list of files in the cache folder
      const files = fs.readdirSync(cacheFolderPath);

      // Iterate through each file and delete it
      files.forEach((file) => {
        const filePath = path.join(cacheFolderPath, file);
        fs.unlinkSync(filePath);
        console.log(`Deleted: ${filePath}`);
      });
      console.log("Cache contents cleared successfully");
    } else {
      console.log("Cache folder not found");
    }
  } catch (error) {
    console.error("Error clearing cache contents:", error);
  }
}

login({ appState: JSON.parse(fs.readFileSync("appstate.json", "utf8")) }, (err, api) => {
  if (err) return console.error(err);
  require("./custom.js")({ api });
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

  api.listenMqtt(async (err, event) => {
    if (err) return console.error(err);
    
    switch (event.type) {
      case "message":
      case "message_reply":
        require("./handlers/handleAI.js")({ api, event });
        require("./handlers/handleMessage.js")({ api, event, config });
        break;
      case "event":
        console.log(event);
        require("./handlers/handleEvents.js")({ api, event });
        break;
    }
  });
});

clearCache();

new Server({
  port: 8080,
  path: "/",
  message: "🤙 Don't let your repl go to sleep!",
  debug: true,
});