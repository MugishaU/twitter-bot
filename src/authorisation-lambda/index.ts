import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda"
import { authorise } from "./endpoints/authorise"
import { refresh } from "./endpoints/refresh"
import { token } from "./endpoints/token"
import { hasKeyGuard } from "./utils/keyGuard"

export const handler = async (
	event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
	let statusCode: number
	let body: string = "" //TODO Change to string at the end
	let headers: { [header: string]: string | number | boolean } | undefined = {
		"Content-Type": "application/json"
	}

	try {
		switch (event.routeKey) {
			case "GET /authorise":
				console.log("authorise endpoint called.")
				const authoriseResult = await authorise()

				statusCode = authoriseResult.statusCode
				body = authoriseResult.body
				if (hasKeyGuard(authoriseResult, "headers")) {
					headers = authoriseResult.headers
				}
				break
			case "GET /token":
				console.log("token endpoint called.")
				if (event.queryStringParameters) {
					const tokenResult = await token(event.queryStringParameters)
					statusCode = tokenResult.statusCode
					body = tokenResult.body
				} else {
					statusCode = 400
					body = "State and/or code not provided."
				}
				break
			case "POST /refresh":
				console.log("refresh endpoint called..")
				const refreshResult = await refresh()

				statusCode = refreshResult.statusCode
				body = refreshResult.body
				break
			default:
				const error = new Error(`Unsupported route: "${event.routeKey}"`)
				console.error(error)
				throw error
		}
	} catch (error) {
		statusCode = 400
		body = error.message || "Undefined Error"
		console.error(body)
	} finally {
		body = JSON.stringify(body)
	}

	return {
		headers,
		statusCode,
		body
	}
}
