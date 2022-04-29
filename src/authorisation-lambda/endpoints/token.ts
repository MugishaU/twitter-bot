import "dotenv/config"
import qs from "qs"
import axios, { Method } from "axios"
import {
	APIGatewayProxyResult,
	APIGatewayProxyEventQueryStringParameters
} from "aws-lambda"
import { getItem, putItem, checkDynamoDbResult } from "../utils/dynamoDB"
import { hasKeyGuard } from "../utils/keyGuard"

const hasStateAndCode = (
	value: unknown
): value is { state: string; code: string } => {
	const hasState = hasKeyGuard(value, "state") && typeof value.state == "string"
	const hasCode = hasKeyGuard(value, "code") && typeof value.code == "string"

	return hasState && hasCode
}

const gatewayResponse = (
	code: number,
	message: string
): APIGatewayProxyResult => {
	return { statusCode: code, body: message }
}

const fetchAndSaveTokens = async (
	code: string
): Promise<APIGatewayProxyResult> => {
	const dynamoDbResult = await getItem("twitter-auth", { id: "codeVerifier" })
	const codeVerifier = checkDynamoDbResult(dynamoDbResult)

	if (codeVerifier) {
		try {
			const url = "https://api.twitter.com/2/oauth2/token"
			const body = {
				code: code,
				grant_type: "authorization_code",
				client_id: "OGVKMXcwWVdsdS1pVkRlZjNVQlM6MTpjaQ",
				redirect_uri:
					"https://pw7fshn6z7.execute-api.eu-west-2.amazonaws.com/token",
				code_verifier: codeVerifier
			}
			const method: Method = "post"
			const clientSecret = `${process.env.CLIENT_SECRET}`
			const options = {
				method: method,
				url: url,
				headers: { "content-type": "application/x-www-form-urlencoded" },
				data: qs.stringify(body),
				auth: {
					username: "OGVKMXcwWVdsdS1pVkRlZjNVQlM6MTpjaQ",
					password: clientSecret
				}
			}
			const result = await axios(options)
			if (hasKeyGuard(result, "data")) {
				const accessToken: string = result.data.access_token
				const refreshToken: string = result.data.refresh_token
				const accessTokenSave = putItem("twitter-auth", {
					id: "accessToken",
					value: accessToken
				})
				const refreshTokenSave = putItem("twitter-auth", {
					id: "refreshToken",
					value: refreshToken
				})

				const accessTokenSaveResult = await accessTokenSave
				const refreshTokenSaveResult = await refreshTokenSave

				if (
					accessTokenSaveResult.statusCode == 200 &&
					refreshTokenSaveResult.statusCode == 200
				) {
					return gatewayResponse(
						200,
						"Access Token and Refresh Token saved to authorisation server."
					)
				} else {
					return gatewayResponse(
						500,
						"Error saving Access Token and Refresh Token to authorisation server"
					)
				}
			}
			return result
		} catch (error) {
			return error
		}
	} else {
		return gatewayResponse(
			404,
			"Code Verifier not found on authorisation server."
		)
	}
}

export const token = async (
	queryParams: APIGatewayProxyEventQueryStringParameters
): Promise<APIGatewayProxyResult> => {
	if (hasStateAndCode(queryParams)) {
		const queryParamState = queryParams.state
		const dynamoDbResult = await getItem("twitter-auth", { id: "state" })
		const dynamoDbState = checkDynamoDbResult(dynamoDbResult)

		if (dynamoDbState) {
			if (queryParamState == dynamoDbState) {
				const tokenResult = await fetchAndSaveTokens(queryParams.code)
				return tokenResult
			} else {
				return gatewayResponse(
					400,
					"State does not match authorisation server."
				)
			}
		} else {
			return gatewayResponse(404, "State not found on authorisation server.")
		}
	}
	return gatewayResponse(404, "State and/or code not provided.")
}
