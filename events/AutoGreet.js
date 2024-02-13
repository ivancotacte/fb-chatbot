const cron = require("node-cron");

function autoGreetMessage(api, event) {
    function sendGreeting(message, time) {
      cron.schedule(
        `0 ${time} * * *`,
        () => {
          api.getThreadList(25, null, ["INBOX"], (err, data) => {
            if (err)
              return console.error(
                `Error [Thread List Cron (${message})]: ` + err,
              );
            let i = 0;
            let j = 0;
            console.log(`\n${message}`);
            while (j < 20 && i < data.length) {
              if (data[i].isGroup && data[i].name !== data[i].threadID) {
                api.sendMessage(
                  `› ${message}!\n${
                    message === "Good morning"
                      ? "Have a great day!"
                      : "Have a nice day!"
                  }`,
                  data[i].threadID,
                  (err) => {
                    if (err) return;
                  },
                );
                j++;
              }
              i++;
            }
          });
        },
        {
          scheduled: true,
          timezone: "Asia/Manila",
        },
      );
    }
  
    sendGreeting("Good morning", "8");
    sendGreeting("Good noon", "11");
    sendGreeting("Good afternoon", "13");
    sendGreeting("Good evening", "19");
    sendGreeting("Good night", "22");
  }
  
  module.exports = autoGreetMessage;  