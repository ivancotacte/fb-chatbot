const config = require('../config.js');

function autoLeaveGroup(api, event) {
    switch (event.logMessageType) {
      case "log:subscribe":
        if (config.ApproveGroupIDS.includes(event.threadID))
            return;
    
          const message = {
            body: "Hello everyone! \n\nGroupID: " + event.threadID,
          };
    
          api.sendMessage(message, event.threadID, () => {
            setTimeout(() => {
              api.removeUserFromGroup(api.getCurrentUserID(), event.threadID)
                .catch((error) => {
                  console.error("Error removing user from group:", error);
                });
            }, 1500);
          });
        break;
    }
  }
  
  module.exports = autoLeaveGroup;
  