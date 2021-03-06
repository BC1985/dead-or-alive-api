const request = require("request");
const cheerio = require("cheerio");

function getDates() {
  const baseUrl = "https://en.wikipedia.org/wiki/";
  const testPerson = "Nick_Drake"; //Case sensitive and underscore between words
  const query = `${baseUrl}${testPerson}`;

  request(query, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(body);
      const birthday = $(".infobox")
        .find("tr")
        .eq(4)
        .text();

      const died = $("td")
        .eq(3)
        .text();

      const shortenedBirthday = function(str, no_words) {
        return str
          .split(" ")
          .splice(0, no_words)
          .join(" ")
          .slice(16, -11);
      };
      const shortenedDeathDate = function(str, no_words) {
        return str
          .split(" ")
          .splice(0, no_words)
          .join(" ")
          .slice(0, -12);
      };

      const formatted =
        shortenedBirthday(birthday, 3) + " - " + shortenedDeathDate(died, 3);

      console.log(formatted);
    }
  });
}
getDates();
