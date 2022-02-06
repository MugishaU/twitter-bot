const twitter = require("./utils/twitter")

const queries = [
	"%23BlackInTech apply now -is:retweet",
	"%23BlackTechTwitter apply now -is:retweet",
	"%23BlackWomenInTech apply now -is:retweet",
]

for (query of queries) {
	twitter.fetch(query)
}
