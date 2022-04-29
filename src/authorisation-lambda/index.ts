import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda"
import { authorise } from "./endpoints/authorise"
import { token } from "./endpoints/token"
import { hasKeyGuard } from "./utils/keyGuard"

export const handler = async (
	event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
	let statusCode: number
	let body: any = ""
	let headers: { [header: string]: string | number | boolean } | undefined = {
		"Content-Type": "application/json"
	}

	try {
		switch (event.routeKey) {
			case "GET /authorise":
				console.log("/authorise called.")

				const result = await authorise()

				statusCode = result.statusCode
				body = result.body
				if (hasKeyGuard(result, "headers")) {
					headers = result.headers
				}
				break
			case "GET /token":
				console.log("/token called.")
				if (event.queryStringParameters) {
					const result = await token(event.queryStringParameters)
					statusCode = result.statusCode
					body = result.body
				} else {
					statusCode = 400
					body = "State and/or code not provided."
				}
				break
			case "POST /refresh":
				console.log("/refresh called.")
				statusCode = 200
				body = "refresh"
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
