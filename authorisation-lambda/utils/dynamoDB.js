const { GetItemCommand, DynamoDBClient } = require("@aws-sdk/client-dynamodb")
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

exports.get = getItem
