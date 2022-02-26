exports.handler = async (event, context) => {
	let statusCode
	let body
	const headers = {
		"Content-Type": "application/json",
	}

	try {
		switch (event.routeKey) {
			case "GET /authorise":
				statusCode = 200
				body = "authorise"
				break
			case "POST /callback":
				statusCode = 200
				body = "callback"
				break
			case "POST /token":
				statusCode = 200
				body = "token"
				break
			case "POST /refresh":
				statusCode = 200
				body = "refresh"
				break
			default:
				throw new Error(`Unsupported route: "${event.routeKey}"`)
		}
	} catch (error) {
		statusCode = 400
		body = error.message ? error.message : "error"
	} finally {
		body = JSON.stringify(body)
	}

	return {
		headers,
		statusCode,
		body,
	}
}
