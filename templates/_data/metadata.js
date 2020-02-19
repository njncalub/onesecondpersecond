const forProduction = process.env.ELEVENTY_ENV == "production";
let siteUrl = "https://onesecondpersecond.glitch.me/";
if (forProduction) {
  siteUrl = "https://onesecondpersecond.github.io/";
}

module.exports = {
  "production": forProduction,
  "site": {
    "title": "1s/s",
    "description": "Living life at the constant rate of 1s/s.",
    "url": siteUrl
  },
  "feed": {
    "filename": "feed.xml",
    "path": "/feed/feed.xml",
    "id": siteUrl
  },
  "author": {
    "name": "Nap Joseph Calub",
    "email": "njncalub@gmail.com"
  }
}