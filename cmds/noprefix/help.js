module.exports = async ({ api, event, config }) => {
    const { prefix } = config;
    const fs = require("fs");
    const path = require("path");
  
    try {
      async function readFilesInDirectory(directoryPath) {
        try {
          const files = await fs.promises.readdir(directoryPath);
  
          const jsFiles = files.filter((file) => {
            const filePath = path.join(directoryPath, file);
            const fileStat = fs.statSync(filePath);
            return fileStat.isFile() && path.extname(filePath) === ".js";
          });
  
          const fileNames = jsFiles.map((file) => path.parse(file).name);
  
          return fileNames;
        } catch (error) {
          console.error("Error reading directory:", error);
          return [];
        }
      }
  
      let commandsArray = await readFilesInDirectory("./cmds/noprefix");
  
      let input = event.body;
      let data = input.split(" ");
      data.shift();
      let query = data[0];
  
      function paginate(arr, pageLength) {
        const numOfPages = Math.ceil(arr.length / pageLength);
        const paginatedArray = [];
  
        for (let i = 0; i < numOfPages; i++) {
          const start = i * pageLength;
          const end = start + pageLength;
          paginatedArray.push(arr.slice(start, end));
        }
        return paginatedArray;
      }
  
      function show(arrList, n) {
        try {
          let r = paginate(arrList, 10);
          let arr = [];
          if (!n) {
            n = 1;
            query = 1;
          }
          let list = r[n - 1];
          for (let i = 0; i < list.length; i++) {
            arr.push(`| ${list[i]}\n`);
          }
          return arr;
        } catch (err) {
          api.sendMessage(`Error: ${err}`, event.threadID, event.messageID);
        }
      }
  
      let result = show(commandsArray, query);
      const numOfPages = paginate(commandsArray, 10).length;
      api.sendMessage(
        `｢Commands｣\n\n${result.join("",)}\n• Page: ${query}/${numOfPages}\n• Commands: ${commandsArray.length}`,
        event.threadID,
        event.messageID,
      );
    } catch (err) {}
}