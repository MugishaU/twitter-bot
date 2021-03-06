import crypto from "crypto"
import base64url from "base64url"
import { generateUrl } from "./ouathUrl"

jest.mock("base64url")
const base64urlMock = base64url as jest.Mocked<typeof base64url>

describe("generateUrl", () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
	})

	it("should generate a Twitter Oauth 2.0 url and security parameters", () => {
		jest
			.spyOn(crypto, "randomBytes")
			.mockImplementationOnce(() => "state")
			.mockImplementationOnce(() => "codeVerifier")
		base64urlMock.fromBase64.mockReturnValue("challenge")

		const url = generateUrl("client", "redirect", ["foo", "bar"])
		expect(url).toStrictEqual({
			state: "state",
			codeVerifier: "codeVerifier",
			oauthUrl:
				"https://twitter.com/i/oauth2/authorize?response_type=code&client_id=client&redirect_uri=redirect&scope=foo%20bar&state=state&code_challenge=challenge&code_challenge_method=S256"
		})
	})
})
