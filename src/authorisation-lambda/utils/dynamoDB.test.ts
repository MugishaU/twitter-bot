import { mockClient } from "aws-sdk-client-mock"
import {
	DynamoDBClient,
	GetItemCommand,
	GetItemCommandOutput,
	PutItemCommand,
} from "@aws-sdk/client-dynamodb"

import { getItem } from "./dynamoDB"

const ddbMock = mockClient(DynamoDBClient)

describe("getItem", () => {
	beforeEach(() => {
		ddbMock.reset()
	})

	describe("when given an appropriate input", () => {
		it("should successfully return the item if in DynamoDb", async () => {
			ddbMock
				.on(GetItemCommand, {
					TableName: "test-table",
					Key: {
						id: {
							S: "0",
						},
					},
				})
				.resolves({
					Item: {
						id: {
							S: "0",
						},
						foo: {
							S: "bar",
						},
					},
					$metadata: { httpStatusCode: 200 },
				})
			const item = await getItem("test-table", { id: "0" })
			expect(item).toStrictEqual({
				statusCode: 200,
				body: { id: "0", foo: "bar" },
			})
		})

		it("should successfully return undefined if not in DynamoDb", async () => {
			ddbMock
				.on(GetItemCommand, {
					TableName: "test-table",
					Key: {
						id: {
							S: "0",
						},
					},
				})
				.resolves({
					$metadata: { httpStatusCode: 200 },
				})
			const item = await getItem("test-table", { id: "0" })
			expect(item).toStrictEqual({ statusCode: 200, body: undefined })
		})
	})
})
