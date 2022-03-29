import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda"

export const handler = async (
	event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
	let statusCode: number
	let body: string = ""
	const headers = {
		"Content-Type": "application/json",
	}

	try {
		switch (event.routeKey) {
			case "GET /authorise":
				console.log("/authorise called.")
				statusCode = 200
				body = "authorise test"
				break
			case "POST /callback":
				console.log("/callback called.")
				statusCode = 200
				body = "callback"
				break
			case "POST /token":
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
		body,
	}
}
