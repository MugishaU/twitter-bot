import "dotenv/config"
import qs from "qs"
import axios from "axios"
import { APIGatewayProxyResult } from "aws-lambda"
import { getItem, putItem, checkDynamoDbResult } from "../utils/dynamoDB"
import { hasKeyGuard } from "../utils/keyGuard"
import { gatewayResponse } from "../utils/gatewayResponse"

export const refresh = async (): Promise<APIGatewayProxyResult> => {
	const dynamoDbResult = await getItem("twitter-auth", { id: "refreshToken" })
	const refreshToken = checkDynamoDbResult(dynamoDbResult)

	if (refreshToken) {
		try {
			const url = "https://api.twitter.com/2/oauth2/token"

			const config = {
				headers: { "content-type": "application/x-www-form-urlencoded" },
				auth: {
					username: "OGVKMXcwWVdsdS1pVkRlZjNVQlM6MTpjaQ",
					password: `${process.env.CLIENT_SECRET}`
				}
			}

			const body = qs.stringify({
				refresh_token: refreshToken,
				grant_type: "refresh_token",
				client_id: "OGVKMXcwWVdsdS1pVkRlZjNVQlM6MTpjaQ"
			})

			const result = await axios.post(url, body, config)

			if (hasKeyGuard(result, "data")) {
				const accessToken: string = result.data.access_token
				const refreshToken: string = result.data.refresh_token
				const accessTokenSave = putItem(
					"twitter-auth",
					{
						id: "accessToken",
						value: accessToken
					},
					true,
					2
				)
				const refreshTokenSave = putItem(
					"twitter-auth",
					{
						id: "refreshToken",
						value: refreshToken
					},
					true,
					2
				)

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
						"Error saving Access Token and Refresh Token to authorisation server."
					)
				}
			} else {
				return gatewayResponse(500, "No data received from server.")
			}
		} catch (error) {
			const statusCode: number = error.response.status
			const body: string = error.message
			return { statusCode, body }
		}
	} else {
		return gatewayResponse(
			404,
			"Refresh Token not found on authorisation server."
		)
	}
}
