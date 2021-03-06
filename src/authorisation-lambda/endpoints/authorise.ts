import { generateUrl } from "../utils/ouathUrl"
import { putItem } from "../utils/dynamoDB"
import { APIGatewayProxyResult } from "aws-lambda"

export const authorise = async (): Promise<APIGatewayProxyResult> => {
	const url = generateUrl(
		"OGVKMXcwWVdsdS1pVkRlZjNVQlM6MTpjaQ",
		"https://pw7fshn6z7.execute-api.eu-west-2.amazonaws.com/token",
		["tweet.read", "tweet.write", "users.read", "offline.access"]
	)

	const putState = putItem("twitter-auth", {
		id: "state",
		value: url.state
	})

	const putCodeVerifier = putItem("twitter-auth", {
		id: "codeVerifier",
		value: url.codeVerifier
	})

	const stateResult = await putState
	const codeVerifierResult = await putCodeVerifier

	if (stateResult.statusCode == 200 && codeVerifierResult.statusCode == 200) {
		return {
			statusCode: 303,
			headers: { Location: url.oauthUrl },
			body: ""
		}
	}

	return {
		statusCode: 500,
		headers: { "Content-Type": "application/json" },
		body: ""
	}
}
