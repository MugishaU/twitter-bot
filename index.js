const twitter = require("./utils/twitter")

const queryString1 = "%23BlackInTech apply now -is:retweet"
const queryString2 = "%23BlackTechTwitter apply now -is:retweet"
const queryString3 = "%23BlackWomenInTech apply now -is:retweet"

twitter.fetch(queryString1)
twitter.fetch(queryString2)
twitter.fetch(queryString3)
