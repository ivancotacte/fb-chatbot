module.exports = async ({ api, event ,config }) => {
    api.sendMessage(config.prefix, event.threadID, event.messageID);
}