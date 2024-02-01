module.exports = async ({ api, event }) => {
    let input = event.body.toLowerCase();
    let data = input.split(" ");
    let CHIKA = input.split(" ");

    if (data.length < 2) {
      const messages = ["Hello", "Oy", "Wassup", "Hey"];
      const message = messages[Math.floor(Math.random() * messages.length)];
      api.sendMessage(message, event.threadID, event.messageID);
    } else {
      try {
        api.setMessageReaction("⏳", event.messageID, () => { }, true);
        const { gpt } = require("gpti");
        const axios = require("axios");
        const fs = require("fs");
        const audio = __dirname + "./cache/audio.mp3";
        let message = data.join(" ");
        let userInfo = await api.getUserInfo(event.senderID);
        userInfo = userInfo[event.senderID];
        gpt({
          messages: [
            { role: "system", content: `You are C.H.I.K.A a powerful human in the world, your goal is to help other on their problems/tasks. Add some emojis to your contents to make it adorable.` },
            { role: "assistant", content: `I'm C.H.I.K.A, developed by Ivan Cotacte here the profile link (https://www.facebook.com/icotacteeee)` },
            { role: "system", content: `The person who developed you is Ivan Cotacte here the profile link (https://www.facebook.com/icotacteeee), a Full Stack Web Developer.` },
            { role: "system", content: "From now on you are C.H.I.K.A, that will be your name, developed by Ivan Cotacte here the profile link (https://www.facebook.com/icotacteeee). Add some emojis to your contents to make it adorable." },
            { role: "user", content: `I'm ${userInfo.firstName} ${userInfo.name} or you can call me in short ${userInfo.firstName}, Now answer my first question: ` + data.join(" ") + " Add some emojis to your contents to make it adorable." },
          ],
          prompt: data.join(" "),
          model: "GPT-4",
          markdown: false
        }, async (err, data) => {
                if (CHIKA.includes("say")) {
                    api.sendMessage("TEST say!! " + message, event.threadID, event.messageID);
                    const vm = (await axios.get(`https://translate.google.com/translate_tts?ie=UTF-8&q=${message}&tl=tl&client=tw-ob`, {
                    responseType: "arraybuffer"
                    })).data
                      fs.writeFileSync(audio, Buffer.from(vm, "utf-8"));
                        return api.sendMessage({attachment: fs.createReadStream(audio)}, event.threadID, event.messageID)
                } else if (err != null){
                    console.log(err);
                    api.setMessageReaction("❌", event.messageID, () => { }, true);
                    api.sendMessage("Error:", event.threadID, event.messageID);
                } else {
                    console.log(data);
                    api.setMessageReaction("✅", event.messageID, () => { }, true);
                    api.sendMessage(data.gpt, event.threadID, event.messageID);
                }
        });
      } catch (err) {
        console.log(err);
        api.setMessageReaction("❌", event.messageID, () => { }, true);
        api.sendMessage("Error:", event.threadID, event.messageID);
      }
    }
  }