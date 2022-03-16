const {
	DynamoDBClient,
	GetItemCommand,
	PutItemCommand,
} = require("@aws-sdk/client-dynamodb")
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb")

const ddbClient = new DynamoDBClient()

const getItem = async (tableName, primaryKey) => {
	const params = {
		TableName: tableName,
		Key: marshall(primaryKey),
	}

	try {
		const data = await ddbClient.send(new GetItemCommand(params))
		const response = {
			statusCode: data.$metadata.httpStatusCode,
			body: data.Item ? unmarshall(data.Item) : undefined,
		}
		return response
	} catch (error) {
		const errorResponse = {
			statusCode: error.$metadata.httpStatusCode,
			body: error.message,
		}

		console.error(errorResponse)
		return errorResponse
	}
}

const putItem = async (tableName, item) => {
	const unixTimestampNow = Math.floor(new Date().getTime() / 1000)
	const sevenDaysInSeconds = 604800
	const ttl = unixTimestampNow + sevenDaysInSeconds
	item.ttl = ttl

	const params = {
		TableName: tableName,
		Item: marshall(item),
	}

	try {
		const data = await ddbClient.send(new PutItemCommand(params))
		const response = {
			statusCode: data.$metadata.httpStatusCode,
		}
		return response
	} catch (error) {
		const errorResponse = {
			statusCode: error.$metadata.httpStatusCode,
			body: error.message,
		}

		console.log(errorResponse)
		return errorResponse
	}
}

exports.getItem = getItem
exports.putItem = putItem
