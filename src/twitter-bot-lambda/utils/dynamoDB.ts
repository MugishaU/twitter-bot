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
	[key: string]: string | number | boolean
}

interface DynamoDbResult {
	statusCode: number
	body?: { [key: string]: string | number | boolean }
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
			statusCode: data.$metadata.httpStatusCode || 500,
			body: data.Item ? unmarshall(data.Item) : undefined
		}
		return response
	} catch (error) {
		console.log(`ERROR: ${error}`)
		if (hasErrorInfo(error)) {
			const errorResponse: DynamoDbResult = {
				statusCode: error.$metadata.httpStatusCode,
				errorMessage: error.message
			}

			console.log(errorResponse)
			return errorResponse
		} else {
			const genericErrorResponse: DynamoDbResult = {
				statusCode: 500,
				errorMessage: "Undefined Error"
			}
			console.log(genericErrorResponse)
			return genericErrorResponse
		}
	}
}

export const putItem = async (
	tableName: string,
	item: DynamoDbItem,
	ttl = true
): Promise<DynamoDbResult> => {
	if (ttl) {
		const unixTimestampNow = Math.floor(new Date().getTime() / 1000)
		const sevenDaysInSeconds = 604800
		const ttl = unixTimestampNow + sevenDaysInSeconds
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
				statusCode: error.$metadata.httpStatusCode,
				errorMessage: error.message
			}

			console.log(errorResponse)
			return errorResponse
		} else {
			const genericErrorResponse: DynamoDbResult = {
				statusCode: 500,
				errorMessage: "Undefined Error"
			}
			console.log(genericErrorResponse)
			return genericErrorResponse
		}
	}
}
