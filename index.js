const { Listen } = require("./login");
const config = require("./config");


Listen(async (api, event) => {
  let userInfo = await api.getUserInfo(event.senderID);
  userInfo = userInfo[event.senderID];

  if (event.type == "message") {
  } else if (event.type == "message_reply") {
  } else if (event.type == "event") {}

  const autoLeave = require("./events/AutoLeave.js");
  switch (event.type) {
    case "event":
      autoLeave(api, event);
      break;
  }
});
