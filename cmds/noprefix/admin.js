module.exports = async ({ api, event, config }) => {
    const input = event.body.toLowerCase();
    const data = input.split(" ");
    const { admins } = config;
    
    function reply(message) {
        api.sendMessage(message, event.threadID, event.messageID)
    }

    if (data.length < 2) {
        return api.sendMessage("Please enter message to admin!", event.threadID, event.messageID);
    } else {
        data.shift();
        let message = data.join(" ");

        let userInfo = await api.getUserInfo(event.senderID);
        userInfo = userInfo[event.senderID];
        let threadInfo = await api.getThreadInfo(event.threadID);
        
        api.sendMessage("Message: "+ message + "\nFrom: " + userInfo.name + "\nGroup: " + threadInfo.threadName, admins[0], () => reply("Your Message to admin has been sent successfully!"))
    }
}