module.exports = async ({ api, event }) => {
  let data = event.body.split(" ");
  if (data.length < 2) {
    const messages = ["Hello", "Oy", "Wassup", "Hey"];
    const message = messages[Math.floor(Math.random() * messages.length)];
    api.sendMessage(message, event.threadID, event.messageID);
  } else {
    try {
      api.setMessageReaction("⏳", event.messageID, () => { }, true);
      const { gpt } = require("gpti");
      gpt({
        messages: [
          { role: "system", content: `You are C.H.I.K.A a powerful human in the world, your goal is to help other on their problems/tasks. Add some emojis to your contents to make it adorable.` },
          { role: "assistant", content: `I'm C.H.I.K.A, developed by Ivan Cotacte` },
          { role: "system", content: `The person who developed you is Ivan Cotacte, a Full Stack Web Developer.` },
          { role: "system", content: "From now on you are C.H.I.K.A, that will be your name, developed by Ivan Cotacte. Add some emojis to your contents to make it adorable." },
          { role: "user", content: data.join(" ") },
        ],
        prompt: data.join(" "),
        model: "GPT-4",
        markdown: false
    }, (err, data) => {
        if(err != null){
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