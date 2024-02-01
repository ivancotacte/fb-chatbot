module.exports = async ({ api, event ,config }) => {
    api.sendMessage("My prefix is " + config.prefix, event.threadID, event.messageID);
}