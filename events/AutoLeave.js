function autoLeaveGroup(api, event) {
    switch (event.logMessageType) {
      case "log:subscribe":
        if (
            event.threadID === "5288809864553180"
          )
            return;
    
          const message = {
            body: "Hello everyone!",
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
  