import { APIGatewayProxyResult } from "aws-lambda"
import { checkDynamoDbResult, getItem } from "./utils/dynamoDB"
import { fetchTweets } from "./utils/twitter"

// const queries = [
// 	"%23BlackInTech apply now -is:retweet",
// 	"%23BlackTechTwitter apply now -is:retweet",
// 	"%23BlackWomenInTech apply now -is:retweet"
// ]

// for (let query of queries) {
// 	fetchTweets(query).then((x) => console.log(x))
// }

interface CloudWatchEvent {
	query: string
}

export const handler = async (event: CloudWatchEvent): Promise<any> => {
	console.log(`Lambda Invoked. Payload: ${event.query}`)
	return "done"
}

const getToken = async (): Promise<string> => {
	const dynamoDbResult = await getItem("twitter-auth", { id: "accessToken" })
	const accessTokenItem = checkDynamoDbResult(dynamoDbResult)
	let accessToken: string = ""

	if (
		!accessTokenItem ||
		(accessTokenItem.ttl &&
			accessTokenItem.ttl < Math.floor(new Date().getTime() / 1000))
	) {
		const refreshTokenResult = await refreshToken()
		if (refreshTokenResult.statusCode == 200) {
			const dynamoDbResult = await getItem("twitter-auth", {
				id: "accessToken"
			})
			const accessTokenItem = checkDynamoDbResult(dynamoDbResult)
			accessTokenItem
				? (accessToken = accessTokenItem.value)
				: (accessToken = "")
		}
	} else {
		accessToken = accessTokenItem.value
	}

	return accessToken
}

const refreshToken = async (): Promise<APIGatewayProxyResult> => {}
