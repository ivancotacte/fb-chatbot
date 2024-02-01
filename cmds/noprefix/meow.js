const http = require("https");
const fs = require("fs");
module.exports = async ({ api, event }) => {
  var url = `https://cataas.com/cat`;
  var file = fs.createWriteStream(__dirname + "/../cache/meow.png");
  http.get(url, function (rqs) {
    rqs.pipe(file);
    file.on("finish", function () {
      api.sendMessage(
        {
          attachment: fs.createReadStream(__dirname + "/../cache/meow.png"),
        },
        event.threadID,
        event.messageID,
      );
    });
  });
};