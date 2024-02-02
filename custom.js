module.exports = async ({ api }) => {
  const cron = require('node-cron');
    const configCustom = {
        autoGreet: {
            status: true,
            time: 60,
            note: 'Automatically greet new members'
        },
        autoRestart: {
            status: true,
            time: 30,
            note: 'To avoid problems, enable periodic bot restarts'
        },
        accpetPending: {
            status: false,
            time: 30, 
            note: 'Approve waiting messages after a certain time'
        }
    }
    function autoRestart(config) {
      if(config.status) {
        setInterval(async () => {
          console.log(`Start rebooting the system!`, "[ Auto Restart ]")
          process.exit(1)
        }, config.time * 60 * 1000)
      }
    }
    function accpetPending(config) {
      if(config.status) {
        setInterval(async () => {
            const list = [
                ...(await api.getThreadList(1, null, ['PENDING'])),
                ...(await api.getThreadList(1, null, ['OTHER']))
            ];
            if (list[0]) {
                api.sendMessage('You have been approved for the queue. (This is an automated message)', list[0].threadID);
            }
        }, config.time * 60 * 1000)
      }
    }
    function autoGreet(config) {
      if(config.status) {
        cron.schedule(`*/${config.time} * * * *`, async () => {
            api.getThreadList(20, null, ["INBOX"], (err, data) => {
              data.forEach((info) => {
                if (info.isGroup && info.isSubscribed) {
                  api.sendMessage("Hello everyone! (This is an automated message)", info.threadID);
                }
              });
            });
          },
          {
            scheduled: true,
            timezone: "Asia/Manila"
          }
          );
        cron.schedule(`0 7 * * *`, async () => {
          api.getThreadList(10, null, ["INBOX"], (err, data) => {
            data.forEach((info) => {
              if (info.isGroup && info.isSubscribed) {
                api.sendMessage("Good morning everyone! (This is an automated message)", info.threadID);
              }
            });
          });
        },
        {
          scheduled: true,
          timezone: "Asia/Manila"
        }
        );
        cron.schedule(`0 12 * * *`, async () => {
          api.getThreadList(10, null, ["INBOX"], (err, data) => {
            data.forEach((info) => {
              if (info.isGroup && info.isSubscribed) {
                api.sendMessage("Good afternoon everyone! (This is an automated message)", info.threadID);
              }
            });
          });
        },
        {
          scheduled: true,
          timezone: "Asia/Manila"
        }
        );
        cron.schedule(`0 18 * * *`, async () => {
          api.getThreadList(10, null, ["INBOX"], (err, data) => {
            data.forEach((info) => {
              if (info.isGroup && info.isSubscribed) {
                api.sendMessage("Good evening everyone! (This is an automated message)", info.threadID);
              }
            });
          });
        },
        {
          scheduled: true,
          timezone: "Asia/Manila"
        }
        );
        cron.schedule(`0 22 * * *`, async () => {
          api.getThreadList(10, null, ["INBOX"], (err, data) => {
            data.forEach((info) => {
              if (info.isGroup && info.isSubscribed) {
                api.sendMessage("Good night everyone! (This is an automated message)", info.threadID);
              }
            });
          });
        },
        {
          scheduled: true,
          timezone: "Asia/Manila"
        }
        );
      }
  }
    autoGreet(configCustom.autoGreet)
    autoRestart(configCustom.autoRestart)
    accpetPending(configCustom.accpetPending)
  };  