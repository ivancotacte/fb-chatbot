module.exports = async ({ api, event }) => {
    const axios = require('axios');
    const fs = require('fs').promises;
    const path = require('path');

    const input = event.body;
    const data = input.split(" ");

    const convos = 'conversations';

    async function conversationHistory(conversation, event) {
      try {
        await fs.writeFile(path.join(convos, `${event.senderID}.json`), JSON.stringify(conversation.slice(-5), null, 2));
      } catch (error) {
        console.error('Error saving conversation to file:', error);
      }
    }
    
    async function loadConversation(event) {
      try {
        const filePath = path.join(convos, `${event.senderID}.json`);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
      } catch (error) {
        if (error.code === 'ENOENT') {
          const yan = [];
          await conversationHistory(yan, event);
          return yan;
        } else {
          console.error('Error loading conversation from file:', error);
          return [];
        }
      }
    }
  
    if (input.startsWith("chika")) {
      if (data.length < 2) {
        const messages = ["Hello", "Oy", "Wassup", "Hey"];
        const message = messages[Math.floor(Math.random() * messages.length)];
        api.sendMessage(message, event.threadID, event.messageID);
      } else {
        data.shift();

        let conversation = await loadConversation(event);

        try {
          const res = await axios.post('https://openchat-ai.onrender.com/chat', {
            prompt: data.join(' '),
            system: '',
            conversation,
          });
      
          const output = res.data.result;
          conversation.push({ role: 'assistant', content: output });
      
          api.sendMessage(output, event.threadID, event.messageID);
          api.setMessageReaction('', event.messageID, () => {}, true);
      
          await conversationHistory(conversation, event);
        } catch (error) {
          api.setMessageReaction("❌", event.messageID, () => {}, true);
          api.sendMessage("Error:", event.threadID, event.messageID);
        }
      }
    }
  };  