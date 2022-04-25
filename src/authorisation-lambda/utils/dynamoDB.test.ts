import { mockClient } from "aws-sdk-client-mock"
import {
	DynamoDB,
	DynamoDBClient,
	GetItemCommand,
	PutItemCommand
} from "@aws-sdk/client-dynamodb"

import {
	getItem,
	putItem,
	checkDynamoDbResult,
	DynamoDbResult
} from "./dynamoDB"

const ddbMock = mockClient(DynamoDBClient)

describe("getItem", () => {
	beforeEach(() => {
		ddbMock.reset()
	})

	it("should successfully return the item if in DynamoDb", async () => {
		ddbMock
			.on(GetItemCommand, {
				TableName: "test-table",
				Key: {
					id: {
						S: "0"
					}
				}
			})
			.resolves({
				Item: {
					id: {
						S: "0"
					},
					foo: {
						S: "bar"
					}
				},
				$metadata: { httpStatusCode: 200 }
			})
		const item = await getItem("test-table", { id: "0" })
		expect(item).toStrictEqual({
			statusCode: 200,
			body: { id: "0", foo: "bar" }
		})
	})

	it("should successfully return undefined if not in DynamoDb", async () => {
		ddbMock
			.on(GetItemCommand, {
				TableName: "test-table",
				Key: {
					id: {
						S: "0"
					}
				}
			})
			.resolves({
				$metadata: { httpStatusCode: 200 }
			})
		const item = await getItem("test-table", { id: "0" })
		expect(item).toStrictEqual({ statusCode: 200, body: undefined })
	})

	it("should return a defined error correctly", async () => {
		ddbMock
			.on(GetItemCommand, {
				TableName: "test-table",
				Key: {
					id: {
						S: "0"
					}
				}
			})
			.rejects({
				$metadata: { httpStatusCode: 400 },
				message: "Requested resource not found"
			})
		const item = await getItem("test-table", { id: "0" })
		expect(item).toStrictEqual({
			statusCode: 400,
			errorMessage: "Requested resource not found"
		})
	})

	it("should return an undefined error correctly", async () => {
		ddbMock
			.on(GetItemCommand, {
				TableName: "test-table",
				Key: {
					id: {
						S: "0"
					}
				}
			})
			.rejects()
		const item = await getItem("test-table", { id: "0" })
		expect(item).toStrictEqual({
			statusCode: 500,
			errorMessage: "Undefined Error"
		})
	})
})

describe("putItem", () => {
	beforeAll(() => {
		jest.useFakeTimers()
		jest.setSystemTime(new Date(2021, 7, 21))
	})

	afterAll(() => {
		jest.useRealTimers()
	})

	beforeEach(() => {
		ddbMock.reset()
	})

	it("should successfully put item into DynamoDb with ttl", async () => {
		ddbMock
			.on(PutItemCommand, {
				TableName: "test-table",
				Item: {
					id: {
						S: "0"
					},
					foo: {
						S: "bar"
					},
					ttl: { N: "1630108800" }
				}
			})
			.resolves({
				$metadata: { httpStatusCode: 200 }
			})

		const item = await putItem("test-table", { id: "0", foo: "bar" })
		expect(item).toStrictEqual({ statusCode: 200 })
	})

	it("should successfully put item into DynamoDb without ttl", async () => {
		ddbMock
			.on(PutItemCommand, {
				TableName: "test-table",
				Item: {
					id: {
						S: "0"
					},
					foo: {
						S: "bar"
					}
				}
			})
			.resolves({
				$metadata: { httpStatusCode: 200 }
			})

		const item = await putItem("test-table", { id: "0", foo: "bar" }, false)
		expect(item).toStrictEqual({ statusCode: 200 })
	})

	it("should return a defined error correctly", async () => {
		ddbMock
			.on(PutItemCommand, {
				TableName: "test-table",
				Item: {
					id: {
						S: "0"
					},
					foo: {
						S: "bar"
					},
					ttl: { N: "1630108800" }
				}
			})
			.rejects({
				$metadata: { httpStatusCode: 400 },
				message: "Requested resource not found"
			})

		const item = await putItem("test-table", { id: "0", foo: "bar" })
		expect(item).toStrictEqual({
			statusCode: 400,
			errorMessage: "Requested resource not found"
		})
	})

	it("should return an undefined error correctly", async () => {
		ddbMock
			.on(PutItemCommand, {
				TableName: "test-table",
				Item: {
					id: {
						S: "0"
					},
					foo: {
						S: "bar"
					},
					ttl: { N: "1630108800" }
				}
			})
			.rejects()

		const item = await putItem("test-table", { id: "0", foo: "bar" })
		expect(item).toStrictEqual({
			statusCode: 500,
			errorMessage: "Undefined Error"
		})
	})
})

describe("checkDynamoDbResult", () => {
	it("should return the dynamoDb item if retrieved successfully", () => {
		const result: DynamoDbResult = {
			statusCode: 200,
			body: { id: "foo", value: "bar" }
		}
		const itemValue = checkDynamoDbResult(result)
		expect(itemValue).toBe("bar")
	})

	it("should return null if the DynamoDB call failed", () => {
		const result: DynamoDbResult = {
			statusCode: 400,
			errorMessage: "Requested resource not found"
		}
		const itemValue = checkDynamoDbResult(result)
		expect(itemValue).toBeNull()
	})

	it("should return null if the DynamoDB call returns no item", () => {
		const result: DynamoDbResult = {
			statusCode: 200,
			body: {}
		}
		const itemValue = checkDynamoDbResult(result)
		expect(itemValue).toBeNull()
	})
})
