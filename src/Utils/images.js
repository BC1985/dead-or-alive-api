const request = require("request");
const cheerio = require("cheerio");

function getImage() {
  const images = [];
  const baseUrl = "https://en.wikipedia.org/wiki/";
  //   Change below to name of person to fetch image of person (case sensitive and with underscore in place)
  const deadMusicians = [
    "Leonard_Cohen",
    "Janis_Joplin",
    "Kurt_Cobain",
    "Jim_Morisson",
    "Ray_Manzarek",
    "Gregg_Allman",
    "Duane_Allman",
    "Joe_Strummer"
    // "Prince_(musician)"
  ];

  const livingMusicians = [
    // ray davies
    // robby krieger
    "Mick_Jagger",
    "Slash_(musician)",
    "Axl_Rose",
    "Keith_Richards",
    "Robert_Smith",
    ""
  ];
  //switch array in loop to livingMusicians to return images
  for (let i = 0; i < deadMusicians.length; i++) {
    const query = `${baseUrl}${deadMusicians[i]}`;
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
      console.log(images);
    });
  }
}
getImage();
