const request = require("request");
const cheerio = require("cheerio");

function getImage() {
  const images = [];
  const baseUrl = "https://en.wikipedia.org/wiki/";
  //Insert below name of musician to fetch image (case sensitive and with underscore between words) ex: David_Bowie
  const musicians = [""];

  for (let i = 0; i < musicians.length; i++) {
    const query = `${baseUrl}${musicians[i]}`;
    request(query, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(body);
        const image = $(".infobox")
          .find("img")
          .attr("src");

        const shortenedImageUrl = function(str) {
          return str.replace("/thumb", "");
        };
        const formatted = `https:${shortenedImageUrl(image)}`;
        const url = formatted.substring(0, formatted.indexOf("/220"));
        images.push(url);
        // console.log("formatted link---", url, "image in array--", images);
      }
      console.log("====================================");
      console.log(images[i]);
      console.log("====================================");
    });
  }
}
getImage();
