module.exports = async ({ api, event }) => {
    const axios = require('axios');

    const input = event.body.toLowerCase();
    const data = input.split(" ");

    if (data.length < 2) {
        return api.sendMessage("Please enter message!", event.threadID, event.messageID);
    } else {
        data.shift();
        const baybayin = await axios.get(`https://api-baybayin-transliterator.vercel.app/?text=${data.join(" ")}`);
        api.sendMessage(baybayin.data.baybayin, event.threadID, event.messageID);
    }
}