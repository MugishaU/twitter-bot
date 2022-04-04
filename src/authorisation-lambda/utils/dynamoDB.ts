import {
	DynamoDBClient,
	GetItemCommand,
	GetItemCommandOutput,
	PutItemCommand
} from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

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
		const errorResponse: DynamoDbResult = {
			statusCode: error.$metadata.httpStatusCode || 500,
			errorMessage: error.message || "Undefined Error"
		}

		console.error(errorResponse)
		return errorResponse
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
		const errorResponse: DynamoDbResult = {
			statusCode: error.$metadata.httpStatusCode || 500,
			errorMessage: error.message || "Undefined Error"
		}

		console.log(errorResponse)
		return errorResponse
	}
}
