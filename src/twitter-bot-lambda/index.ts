import { EventBridgeEvent, APIGatewayProxyResult } from "aws-lambda"
import { fetchTweets } from "./utils/twitter"

// const queries = [
// 	"%23BlackInTech apply now -is:retweet",
// 	"%23BlackTechTwitter apply now -is:retweet",
// 	"%23BlackWomenInTech apply now -is:retweet"
// ]

// for (let query of queries) {
// 	fetchTweets(query).then((x) => console.log(x))
// }

export const handler = async (
	event: EventBridgeEvent<string, string>
): Promise<any> => {
	return event.detail
}
