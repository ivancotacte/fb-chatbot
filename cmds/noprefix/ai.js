module.exports = async ({ api, event }) => {
    let data = event.body.split(" ");
    if (data.length < 2) {
      const messages = ["Hello", "Oy", "Wassup", "Hey"];
      const message = messages[Math.floor(Math.random() * messages.length)];
      api.sendMessage(message, event.threadID, event.messageID);
    } else {
      try {
        api.setMessageReaction("⏳", event.messageID, () => { }, true);
        const { G4F } = require("g4f");
        const GPT = new G4F();
        const messages = [
          { role: "user", content: data.join(" ") },
          { role: "system", content: "From now on you are C.H.I.K.A, that will be your name, developed by Ivan Cotacte. Add some emojis to your contents to make it adorable." }
        ];
        const response = await GPT.chatCompletion(messages);
        api.setMessageReaction("✅", event.messageID, () => { }, true);
        api.sendMessage(response, event.threadID, event.messageID);
        console.log(response);
      } catch (err) {
        console.log(err);
        api.setMessageReaction("❌", event.messageID, () => { }, true);
        api.sendMessage("Error:", event.threadID, event.messageID);
      }
    }
  }