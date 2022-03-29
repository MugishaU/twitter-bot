import { mockClient } from "aws-sdk-client-mock"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

const ddbMock = mockClient(DynamoDBClient)

describe("getItem", () => {
	beforeEach(() => {
		ddbMock.reset()
	})

	it("should just pass for now", () => {
		expect(true)
	})
})
