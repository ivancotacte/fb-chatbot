module.exports = async ({ api, event }) => {
  const path = require("path");
  const fs = require("fs");
  const { scrapeAndSaveData } = require("./handleGoSerh.js");

  const input = event.body.toLowerCase();
  const input1 = event.body.toLowerCase().slice(1);
  const data = input.split(" ");

  if (input.startsWith("chika") || input1.startsWith("chika")) {
    if (data.length < 2) {
      const messages = ["Hello", "Oy", "Wassup", "Hey"];
      const message = messages[Math.floor(Math.random() * messages.length)];
      api.sendMessage(message, event.threadID, event.messageID);
    } else {
      try {
        data.shift();
        api.setMessageReaction("⏳", event.messageID, () => {}, true);
        const { gpt } = require("gpti");

        await scrapeAndSaveData(data.join(" "));
        const dataFilePath = path.join(__dirname, "search.json");
        const Data = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));

        let userInfo = await api.getUserInfo(event.senderID);
        userInfo = userInfo[event.senderID];
        gpt(
          {
            messages: [
              {
                role: "assistant",
                content: `I'm C.H.I.K.A, developed by Ivan Cotacte here the profile link (https://www.facebook.com/icotacteeee)`,
              },
              {
                role: "user",
                content:
                  `I'm ${userInfo.firstName} ${userInfo.name} or you can call me in short ${userInfo.firstName}, The data available to you is encapsulated in ${JSON.stringify(
                    Data,
                    null,
                    2,
                  )}. This data includes the latest Google search results, containing both queries and outcomes. Now answer my first question: ${data.join(" ")}?`,
              },
            ],
            model: "GPT-4",
            markdown: false,
          },
          async (err, respond) => {
            if (data.includes("play") || data.includes("music")) {
              try {
                const ytdl = require("ytdl-core");
                const yts = require("yt-search");
                const fs = require("fs");
                const Genius = require("genius-lyrics");
                const axios = require("axios");

                const removeString = data
                  .filter((item) => !["play", "music"].includes(item))
                  .join(" ");

                const musicName = removeString;
                const searchResults = await yts(musicName);

                if (!searchResults.videos.length) {
                  return api.sendMessage(
                    "Can't find!",
                    event.threadID,
                    event.messageID,
                  );
                } else {
                  const music = searchResults.videos[0];
                  const musicUrl = music.url;

                  const Client = new Genius.Client(
                    "BrcPSWn_hf_Q6WLokk7Wo1b8xVpCJCjyfarTjTP5_5MWDQ4WQ6Wt6FXWcaIvbq0p",
                  );
                  const searches = await Client.songs.search(music.title);
                  const music1 = searches[0];

                  const musicTitle = music1.title || "";
                  const musicAuthor = music1._raw.artist_names || "";
                  const ReleaseDate = music1._raw.release_date_for_display || "";

                  const stream = ytdl(musicUrl, { filter: "audioonly" });

                  const fileName = `${event.senderID}.mp3`;
                  const filePath = __dirname + `/../cache/${fileName}`;

                  stream.pipe(fs.createWriteStream(filePath));

                  stream.on("response", () => {
                    console.info("[DOWNLOADER]", "Starting download now!");
                  });

                  stream.on("info", (info) => {
                    console.info(
                      "[DOWNLOADER]",
                      `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`,
                    );
                  });

                  stream.on("end", () => {
                    console.info("[DOWNLOADER] Downloaded");

                    if (fs.statSync(filePath).size > 26214400) {
                      fs.unlinkSync(filePath);
                      return console.log(
                        "[DOWNLOADER]",
                        "The file could not be sent because it is larger than 25MB.",
                      );
                    }

                    const messages = [
                      `Sure, I can play "${musicTitle}" by ${musicAuthor}!`,
                      `I found "${musicTitle}" by ${musicAuthor}!`,
                      `I got "${musicTitle}" by ${musicAuthor}!`,
                      `I can play "${musicTitle}" by ${musicAuthor}!`,
                      `Yes! I can play "${musicTitle}" by ${musicAuthor}!`,
                    ];
                    const randomMessage =
                      messages[Math.floor(Math.random() * messages.length)];

                    api.sendMessage(
                      {
                        body: randomMessage,
                        attachment: fs.createReadStream(filePath),
                      },
                      event.threadID,
                      () => {
                        fs.unlinkSync(filePath);
                      },
                    );
                  });
                }
              } catch (err) {}
            } else if (input.includes("say")) {
              try {
                const axios = require("axios");
                const fs = require("fs");
                const audio = __dirname + `/../cache/say_${event.senderID}.mp3`;
                const vm = (
                  await axios.get(
                    `https://translate.google.com/translate_tts?ie=UTF-8&q=${respond.gpt}&tl=tl&client=tw-ob`,
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
              } catch (err) {}
            } else if (err != null) {
              console.log(err);
              api.setMessageReaction("❌", event.messageID, () => {}, true);
              api.sendMessage("Error:", event.threadID, event.messageID);
            } else {
              api.setMessageReaction("✅", event.messageID, () => {}, true);
              api.sendMessage(respond.gpt, event.threadID, event.messageID);
            }
          },
        );
      } catch (err) {
        console.log(err);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        api.sendMessage("Error:", event.threadID, event.messageID);
      }
    }
  }
};