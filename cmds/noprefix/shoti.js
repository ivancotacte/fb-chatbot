module.exports = async ({ api, event }) => {
    try {
      const axios = require("axios");
      const request = require("request");
      const fs = require("fs");
      let response = await axios.post(
        "https://your-shoti-api.vercel.app/api/v1/get",
        {
          apikey: "$shoti-1hg36l9b797ba14650g",
        },
      );
      if (response.data.code !== 200) {
        api.sendMessage(
          `API ERROR: ${response.data}`,
          event.threadID,
          event.messageID,
        );
        return;
      }
      var file = fs.createWriteStream(__dirname + "/../cache/shoti.mp4");
      var rqs = request(encodeURI(response.data.data.url));
      rqs.pipe(file);
      file.on("finish", () => {
        return api.sendMessage(
          {
            body: `Username: ${response.data.data.user.username}\nNickname: ${response.data.data.user.nickname}\nID: ${response.data.data.user.userID}`,
            attachment: fs.createReadStream(__dirname + "/../cache/shoti.mp4"),
          },
          event.threadID,
          event.messageID,
        );
      });
      file.on("error", (err) => {
        api.sendMessage(`Shoti Error: ${err}`, event.threadID, event.messageID);
        console.log(`Shoti Error: ${err}`);
      });
    } catch (error) {
      console.log("An error occurred while generating video:" + error);
      api.sendMessage(
        "An error occurred while generating video:" + error,
        event.threadID,
        event.messageID,
      );
    }
  };
  