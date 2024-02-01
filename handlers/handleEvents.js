const path = require("path");
const fs = require("fs");
const https = require("https");

module.exports = async ({ api, event }) => {
    if (event.logMessageType == "log:subscribe") {
      const addedParticipants = event.logMessageData.addedParticipants;
      addedParticipants.forEach(async (participant) => {
        const joinMemberID = participant.userFbId;
        const joinMemberInfo = await api.getUserInfo(joinMemberID);
        const joinMemberfullName = joinMemberInfo[joinMemberID].name;
        const welcome = [`Wassup,`, `Welcome,`, "Supp,", "Wazzup,"];
        const randomIndex = Math.floor(Math.random() * welcome.length);
        const welcomeMessage = welcome[randomIndex];
        var imageUrl = `https://api-punm.onrender.com/api/fbimage/${joinMemberID}`;
        var imagePath = path.join(__dirname, `/../cache/${joinMemberID}.jpg`);
        const imageStream = fs.createWriteStream(imagePath);
        https.get(imageUrl, (response) => {
          response.pipe(imageStream);
          imageStream.on("finish", () => {
            api.sendMessage(
              {
                body: `${welcomeMessage} @${joinMemberfullName}`,
                mentions: [{
                  tag: joinMemberfullName,
                  id: joinMemberID
                }],
                attachment: fs.createReadStream(imagePath),
              },
              event.threadID,
            );
          });
        });
      });
    } else if (event.logMessageType == "log:unsubscribe") {
    } else if (event.logMessageType == "log:link-status") {
      api.sendMessage(event.logMessageBody, event.threadID);
    } else if (event.logMessageType == "log:thread-approval-mode") {
      api.sendMessage(event.logMessageBody, event.threadID);
    } else if (event.logMessageType == "log:magic-words") {
      api.sendMessage(
        `Theme ${event.logMessageData.magic_word} added effect: ${event.logMessageData.theme_name
        }\nEmoij: ${event.logMessageData.emoji_effect || "No emoji "}\nTotal ${event.logMessageData.new_magic_word_count
        } word effect added`,
        event.threadID,
      );
    }
};