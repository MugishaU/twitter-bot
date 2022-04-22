import {
	APIGatewayProxyResult,
	APIGatewayProxyEventQueryStringParameters
} from "aws-lambda"
import { getItem, putItem, DynamoDbResult } from "../utils/dynamoDB"
import { hasKeyGuard } from "../utils/keyGuard"

const hasStateAndCode = (
	value: unknown
): value is { state: string; code: string } => {
	const hasState = hasKeyGuard(value, "state") && typeof value.state == "string"
	const hasCode = hasKeyGuard(value, "code") && typeof value.code == "string"

	return hasState && hasCode
}

const checkDynamoDbState = (item: DynamoDbResult): string | null => {
	if (
		item.statusCode == 200 &&
		hasKeyGuard(item, "body") &&
		hasKeyGuard(item.body, "value") &&
		typeof item.body.value == "string"
	) {
		return item.body.value
	}
	return null
}

const gatewayResponse = (
	code: number,
	message: string
): APIGatewayProxyResult => {
	return { statusCode: code, body: message }
}

export const token = async (
	queryParams: APIGatewayProxyEventQueryStringParameters
): Promise<APIGatewayProxyResult> => {
	if (hasStateAndCode(queryParams)) {
		const queryParamState = queryParams.state
		const dynamoDbResult = await getItem("twitter-auth", { id: "state" })
		const dynamoDbState = checkDynamoDbState(dynamoDbResult)

		if (dynamoDbState) {
			if (queryParamState == dynamoDbState) {
				return gatewayResponse(200, "match")
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
