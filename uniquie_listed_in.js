const fs = require("fs");
const { parse } = require("json2csv");

const newFile = [];
(async function convertArrayToCategory() {
  fs.readFile("./netflix_titles.json", (err, data) => {
    if (err) throw err;
    const movies = JSON.parse(data);
    movies.map((movie) => {
      const categories = movie.listed_in.split(",");
      categories.map((categorie) => {
        newFile.push({ ...movie, listed_in: categorie.trim() });
      });
    });
    fs.writeFileSync("netflix_titles_listed_in.csv", parse(newFile));
  });
})();
