module.exports = async ({ api, event }) => {
    const input = event.body;
    const data = input.split(" ");
  
    if (input.startsWith("test")) {
      if (data.length < 2) {
        const messages = ["Hello", "Oy", "Wassup", "Hey"];
        const message = messages[Math.floor(Math.random() * messages.length)];
        api.sendMessage(message, event.threadID, event.messageID);
      } else {
        data.shift();
        const message = data.join(" ");
        api.sendMessage(message, event.threadID, event.messageID);
      }
    }
  };  