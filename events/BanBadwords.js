const BanModel = require("../includes/database/BanModel.js");
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "dbBan"
});

module.exports = async ({ api, event }) => {
    const badwords = [
        "tangina", 
        "putangina", 
        "gago", 
        "puta", 
        "amputa", 
        "dede", 
        "puke", 
        "tite", 
        "nipples", 
        "nudes", 
        "pangit", 
        "tamod", 
        "banmesenpai", 
        "cock", 
        "penis", 
        "cum", 
        "chupa", 
        "boobs", 
        "pussy"
      ]

      let data = event.body.split(" ");
      data.shift(" ");
      let message = data.join(" ");
      if(badwords.includes(message)) {
        let cID = api.getCurrentUserID(event.senderID);
        let userInfo = await api.getUserInfo(cID);
        userInfo = userInfo[cID];

        userBan = new BanModel({
            fbID: cID,
            fbFullName: userInfo.name
        })

        await userBan.save();
      }
}