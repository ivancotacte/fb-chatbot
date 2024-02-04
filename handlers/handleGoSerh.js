const path = require("path");
const http = require("http");
const fs = require("fs");

const scrapeAndSaveData = async (Search) => {
  const encodedQuery = encodeURIComponent(Search.replace(/\s+/g, "+"));
  const url = `http://www.google.com/search?q=${encodedQuery}`;
  const request = http.request(url, function (response) {
    let data = "";
    response.on("data", function (chunk) {
      data += chunk;
    });
    response.on("end", function () {
      const matches = data.match(
        /<div class="BNeawe s3v9rd AP7Wnd">(.*?)<\/div>/g,
      );
      const results = matches
        ? matches.map((match) => match.replace(/<\/?[^>]+(>|$)/g, ""))
        : [];
      const output = {
        searchQuery: Search,
        searchResults: results,
      };

      const dataFilePath = path.join(__dirname, "./search.json");
      fs.writeFileSync(dataFilePath, JSON.stringify(output, null, 2));
    });
  });
  request.end();
};

module.exports = { scrapeAndSaveData };