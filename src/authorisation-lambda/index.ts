import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda"
import { authorise } from "./endpoints/authorise"
import { hasKeyGuard } from "./utils/keyGuard"

export const handler = async (
	event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
	let statusCode: number
	let body: string = ""
	let headers: { [header: string]: string | number | boolean } | undefined = {
		"Content-Type": "application/json"
	}

	try {
		switch (event.routeKey) {
			case "GET /authorise":
				console.log("/authorise called.")

				const call = await authorise()

				statusCode = call.statusCode
				body = call.body
				if (hasKeyGuard(call, "headers")) {
					headers = call.headers
				}
				break
			case "GET /token":
				console.log("/token called.")
				statusCode = 200
				body = "token"
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
