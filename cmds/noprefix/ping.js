module.exports = async ({ api, event }) => {
    api.sendMessage("Pong!", event.threadID, event.messageID);
};