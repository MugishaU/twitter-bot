import axios from "axios"
import { checkDynamoDbResult, getItem } from "./utils/dynamoDB"
import { fetchTweets } from "./utils/twitter"
import { aws4Interceptor } from "aws4-axios"

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
		if (refreshTokenResult == 200) {
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

const refreshToken = async (): Promise<number> => {
	const interceptor = aws4Interceptor({
		region: "eu-west-2",
		service: "execute-api"
	})

	axios.interceptors.request.use(interceptor)

	const url = "https://pw7fshn6z7.execute-api.eu-west-2.amazonaws.com/refresh"

	try {
		const axiosResponse = await axios.get(url)
		return axiosResponse.status
	} catch (error) {
		if (error.response) {
			return error.response.status
		} else {
			return 500
		}
	}
}
