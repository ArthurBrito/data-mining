const fs = require("fs");
const moment = require("moment"); // Date manipulation library

const { parse } = require("json2csv");

(async function convertArrayToCategory() {
  fs.readFile("./netflix_titles.json", (err, data) => {
    if (err) throw err;
    const movies = JSON.parse(data);
    const moviesOnly = movies.filter((movie) => movie.type == "Movie");

    const adventure = moviesOnly.filter(
      (movie) => movie.listed_in.indexOf("Action & Adventure") >= 0
    );

    const dateAndCountMap = {};
    const adventure = adventure.map((movie, i) => {
      const withoutComma = movie.date_added.replace(",", "");
      const dateBreakbown = withoutComma.split(" ");

      movie.date_added = moment()
        .month(dateBreakbown[0])
        .year(dateBreakbown[2])
        .format("MM YYYY");

      if (dateAndCountMap[movie.date_added]) {
        dateAndCountMap[movie.date_added] =
          dateAndCountMap[movie.date_added] + 1;
      } else {
        dateAndCountMap[movie.date_added] = 1;
      }

      return movie;
    });
    const array = [];
    Object.keys(dateAndCountMap).map((date_added) => {
      array.push({
        date_added: moment(date_added, "MM YYYY").valueOf(),
        counter: dateAndCountMap[date_added],
      });
    });

    const dataSorted = array.sort((a, b) => a.date_added - b.date_added);

    fs.writeFileSync("netflix_titles_action_filtered.csv", parse(dataSorted));
  });
})();
