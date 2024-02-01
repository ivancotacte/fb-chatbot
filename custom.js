module.exports = async ({ api }) => {
    const configCustom = {
        autoGreet: {
            status: true,
            time: 30,
            note: 'Automatically greet new members'
        },
        autoRestart: {
            status: false,
            time: 40,
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

        }
    }
    autoGreet(configCustom.autoGreet)
    autoRestart(configCustom.autoRestart)
    accpetPending(configCustom.accpetPending)
  };  