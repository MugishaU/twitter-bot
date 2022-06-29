import axios from "axios"
import { aws4Interceptor } from "aws4-axios"
import { checkDynamoDbResult, getItem } from "../utils/dynamoDB"

export const getToken = async (): Promise<string> => {
	const dynamoDbResult = await getItem("twitter-auth", { id: "accessToken" })
	const accessTokenItem = checkDynamoDbResult(dynamoDbResult)
	let accessToken: string = ""

	if (!accessTokenItem) {
		const refreshTokenResult = await refreshToken()

		if (refreshTokenResult == 200) {
			const dynamoDbResult = await getItem("twitter-auth", {
				id: "accessToken"
			})
			const accessTokenItem = checkDynamoDbResult(dynamoDbResult)
			accessTokenItem
				? (accessToken = accessTokenItem.value)
				: (accessToken = "")
		}
	} else {
		accessToken = accessTokenItem.value
	}

	return accessToken
}

export const refreshToken = async (): Promise<number> => {
	const interceptor = aws4Interceptor({
		region: "eu-west-2",
		service: "execute-api"
	})

	const awsSignedAxios = axios.create()
	awsSignedAxios.interceptors.request.use(interceptor)

	const url = "https://pw7fshn6z7.execute-api.eu-west-2.amazonaws.com/refresh"

	try {
		const axiosResponse = await awsSignedAxios.get(url)
		return axiosResponse.status
	} catch (error) {
		if (error.response) {
			console.error(error.message)
			return error.response.status
		} else {
			return 500
		}
	}
}
