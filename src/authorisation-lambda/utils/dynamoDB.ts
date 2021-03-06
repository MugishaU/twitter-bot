import {
	DynamoDBClient,
	GetItemCommand,
	GetItemCommandOutput,
	PutItemCommand
} from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { hasKeyGuard } from "./keyGuard"

interface DynamoDbPrimaryKey {
	id: string
}

interface DynamoDbItem {
	id: string
	value: string
	ttl?: number
}

interface DynamoDbResult {
	statusCode: number
	body?: DynamoDbItem
	errorMessage?: string
}

const hasErrorInfo = (
	value: unknown
): value is { message: string; $metadata: { httpStatusCode: number } } => {
	const hasMessage =
		hasKeyGuard(value, "message") && typeof value.message === "string"

	if (hasKeyGuard(value, "$metadata")) {
		const $metadata = value.$metadata
		if (hasKeyGuard($metadata, "httpStatusCode")) {
			const hasHttpStatusCode = typeof $metadata.httpStatusCode === "number"
			return hasMessage && hasHttpStatusCode
		}
	}
	return false
}

const formatTime = (time: number): number => {
	if (time < 1) {
		time = 1
	}

	return Math.floor(time)
}

const ddbClient = new DynamoDBClient({})

export const getItem = async (
	tableName: string,
	primaryKey: DynamoDbPrimaryKey
): Promise<DynamoDbResult> => {
	const params = {
		TableName: tableName,
		Key: marshall(primaryKey)
	}

	try {
		const data: GetItemCommandOutput = await ddbClient.send(
			new GetItemCommand(params)
		)

		const response: DynamoDbResult = {
			statusCode: data.$metadata.httpStatusCode || 500
		}

		if (data.Item) {
			const item = unmarshall(data.Item)

			if (
				hasKeyGuard(item, "id") &&
				typeof item.id == "string" &&
				hasKeyGuard(item, "value") &&
				typeof item.value == "string"
			) {
				response.body = { id: item.id, value: item.value }

				if (hasKeyGuard(item, "ttl") && typeof item.ttl == "number") {
					response.body.ttl = item.ttl
				}
			}
		}

		return response
	} catch (error) {
		if (hasErrorInfo(error)) {
			const errorResponse: DynamoDbResult = {
				statusCode: error.$metadata.httpStatusCode || 500,
				errorMessage: error.message
			}

			console.error(errorResponse)
			return errorResponse
		} else {
			const genericErrorResponse: DynamoDbResult = {
				statusCode: 500,
				errorMessage: "Undefined Error"
			}
			console.error(genericErrorResponse)
			return genericErrorResponse
		}
	}
}

export const putItem = async (
	tableName: string,
	item: DynamoDbItem,
	ttl = true,
	hours = 168
): Promise<DynamoDbResult> => {
	if (ttl) {
		const unixTimestampNow = Math.floor(new Date().getTime() / 1000)
		const seconds = formatTime(hours) * 3600
		const ttl = unixTimestampNow + seconds
		item.ttl = ttl
	}

	const params = {
		TableName: tableName,
		Item: marshall(item)
	}

	try {
		const data: GetItemCommandOutput = await ddbClient.send(
			new PutItemCommand(params)
		)
		const response: DynamoDbResult = {
			statusCode: data.$metadata.httpStatusCode || 500
		}
		return response
	} catch (error) {
		if (hasErrorInfo(error)) {
			const errorResponse: DynamoDbResult = {
				statusCode: error.$metadata.httpStatusCode || 500,
				errorMessage: error.message
			}

			console.error(errorResponse)
			return errorResponse
		} else {
			const genericErrorResponse: DynamoDbResult = {
				statusCode: 500,
				errorMessage: "Undefined Error"
			}
			console.error(genericErrorResponse)
			return genericErrorResponse
		}
	}
}

export const checkDynamoDbResult = (
	item: DynamoDbResult
): DynamoDbItem | null => {
	if (
		item.statusCode == 200 &&
		hasKeyGuard(item, "body") &&
		typeof item.body == "object"
	) {
		if (item.body.ttl) {
			const condition = item.body.ttl > Math.floor(new Date().getTime() / 1000)
			return condition ? item.body : null
		}

		return item.body
	}
	return null
}
