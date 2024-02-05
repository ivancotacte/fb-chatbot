module.exports = async ({ api, event, config }) => {
    const input = event.body.toLowerCase();
    const data = input.split(" ");

    function reply(message){
        api.sendMessage(message, event.threadID, event.messageID)
        }

    if (data.length < 2) {
        return api.sendMessage("Example:\nconfess Hello | 100050076673558", event.threadID, event.messageID);
    } else {
        data.shift();

        const content = data.join(" ").split("|").map(item => item = item.trim());

        let message = content[0];
        let uid = content[1];

        if (!message) {
            return api.sendMessage("Please enter message!", event.threadID, event.messageID);
        }
        if (!uid) {
            return api.sendMessage("UID is not valid", event.threadID, event.messageID);
        }

        api.sendMessage("Someone bot user has confess on you, here is the confess please read it.\n\nMessage: "+ message, uid, () => reply("Confession has been sent successfully!"))
    }
}