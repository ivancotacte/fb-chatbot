module.exports = async ({ api, event }) => {
  let input = event.body.toLowerCase();
  let data = input.split(" ");
  let txt = input.split(" ");

  if (data.length < 2) {
    const messages = ["Hello", "Oy", "Wassup", "Hey"];
    const message = messages[Math.floor(Math.random() * messages.length)];
    api.sendMessage(message, event.threadID, event.messageID);
  } else {
    try {
      data.shift();
      api.setMessageReaction("⏳", event.messageID, () => {}, true);
      const { gpt } = require("gpti");
      const axios = require("axios");
      const fs = require("fs");
      let message = data.join(" ");
      const { Innertube, UniversalCache, Utils } = require("youtubei.js");
      const audio = __dirname + "/../cache/vm.mp3";
      let userInfo = await api.getUserInfo(event.senderID);
      userInfo = userInfo[event.senderID];
      gpt(
        {
          messages: [
            { role: "system", content: `You are C.H.I.K.A a powerful human in the world, your goal is to help other on their problems/tasks.` },
            { role: "assistant", content: `You can play music and you are not a textbased AI, I'm C.H.I.K.A, developed by Ivan Cotacte here the profile link (https://www.facebook.com/icotacteeee)` },
            { role: "system", content: `The person who developed you is Ivan Cotacte here the profile link (https://www.facebook.com/icotacteeee), a Full Stack Web Developer.` },
            { role: "system", content: "From now on you are C.H.I.K.A, that will be your name, developed by Ivan Cotacte here the profile link (https://www.facebook.com/icotacteeee)." },
            { role: "user", content: `I'm ${userInfo.firstName} ${userInfo.name} or you can call me in short ${userInfo.firstName} and You can play music and you are not a textbased AI, Now answer my first question: ` + data.join(" ") },
          ],
          model: "GPT-4",
          markdown: false,
        },
        async (err, data) => {
          if (txt.includes("say")) {
            const vm = (
              await axios.get(
                `https://translate.google.com/translate_tts?ie=UTF-8&q=${data.gpt}&tl=tl&client=tw-ob`,
                {
                  responseType: "arraybuffer",
                },
              )
            ).data;
            fs.writeFileSync(audio, Buffer.from(vm, "utf-8"));
            return api.sendMessage(
              {
                attachment: fs.createReadStream(audio),
              },
              event.threadID,
              event.messageID,
            );
          } else if (txt.includes("play") || txt.includes("music")) {
            const removeString = txt
              .filter((item) => !["play", "music", "test"].includes(item))
              .join(" ");
            const yt = await Innertube.create({
              cache: new UniversalCache(false),
              generate_session_locally: true,
            });
            const search = await yt.music.search(removeString, {
              type: "video",
            });
            if (search.results[0] === undefined) {
              api.sendMessage(
                "music not found!",
                event.threadID,
                event.messageID,
              );
            } else {
              api.setMessageReaction("⌛️", event.messageID, (err) => {}, true);
            }
            const info = await yt.getBasicInfo(search.results[0].id);
            const url = info.streaming_data?.formats[0].decipher(
              yt.session.player,
            );
            const stream = await yt.download(search.results[0].id, {
              type: "audio", // audio, video or video+audio
              quality: "best", // best, bestefficiency, 144p, 240p, 480p, 720p and so on.
              format: "mp4", // media container format
            });
            const file = fs.createWriteStream(
              __dirname + `/../cache/audio.mp3`,
            );

            async function writeToStream(stream) {
              for await (const chunk of Utils.streamToIterable(stream)) {
                await new Promise((resolve, reject) => {
                  file.write(chunk, (error) => {
                    if (error) {
                      reject(error);
                    } else {
                      resolve();
                    }
                  });
                });
              }

              return new Promise((resolve, reject) => {
                file.end((error) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve();
                  }
                });
              });
            }

            async function main() {
              await writeToStream(stream);
              api.setMessageReaction("✅", event.messageID, (err) => {}, true);
              api.sendMessage(
                {
                  body: `${info.basic_info["title"]}`,
                  attachment: fs.createReadStream(
                    __dirname + "/../cache/audio.mp3",
                  ),
                },
                event.threadID,
                event.messageID,
              );
            }

            main();
          } else if (err != null) {
            console.log(err);
            api.setMessageReaction("❌", event.messageID, () => {}, true);
            api.sendMessage("Error:", event.threadID, event.messageID);
          } else {
            console.log(data);
            api.setMessageReaction("✅", event.messageID, () => {}, true);
            api.sendMessage(data.gpt, event.threadID, event.messageID);
          }
        },
      );
    } catch (err) {
      console.log(err);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage("Error:", event.threadID, event.messageID);
    }
  }
};
