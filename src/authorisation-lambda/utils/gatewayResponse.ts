import { APIGatewayProxyResult } from "aws-lambda"

export const gatewayResponse = (
	code: number,
	message: string
): APIGatewayProxyResult => {
	return { statusCode: code, body: message }
}
