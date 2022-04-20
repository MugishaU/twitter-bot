import {
	APIGatewayProxyResult,
	APIGatewayProxyEventQueryStringParameters
} from "aws-lambda"
import { getItem, putItem } from "../utils/dynamoDB"
import { hasKeyGuard } from "../utils/keyGuard"

const hasStateAndCode = (
	value: unknown
): value is { state: string; code: string } => {
	const hasState = hasKeyGuard(value, "state") && typeof value.state == "string"
	const hasCode = hasKeyGuard(value, "code") && typeof value.code == "string"

	return hasState && hasCode
}

export const token = async (
	queryParams: APIGatewayProxyEventQueryStringParameters
): Promise<APIGatewayProxyResult> => {
	if (hasStateAndCode(queryParams)) {
		const queryParamState = queryParams.state
		const dynamoDbState = await getItem("twitter-auth", { id: "state" })
	}

	return {
		statusCode: 404,
		body: "state and/or code not provided in query paramters"
	}
}
