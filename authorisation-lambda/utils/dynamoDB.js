const AWS = require("aws-sdk")

const docClient = new AWS.DynamoDB.DocumentClient()

const get = (tableName, primaryKey) => {
	const params = {
		TableName: tableName,
		Key: primaryKey,
	}

	docClient.get(params, function (err, data) {
		if (err) {
			console.error("Unable to query. Error:", JSON.stringify(err, null, 2))
		} else {
			console.log("Query succeeded.")

			const result = true ? data.Item : null
			console.log(result)
			return data.Item
		}
	})
}
const v = get("twitter-auth", { id: "1" })
get("twitter-auth", { id: "1" })

exports.get = get
