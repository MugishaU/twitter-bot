import "dotenv/config"
import crypto from "crypto"
import base64url from "base64url"

const generateUrl = (redirectUri: string, scope: string[]): any => {
	const twitterUrl = "https://twitter.com/i/oauth2/authorize"
	const clientId = process.env.CLIENT_ID
	const flatScope = scope.join("%20")

	const responseType = "code"
	const codeChallengeMethod = "S256"
	const state = crypto.randomBytes(64).toString("hex")

	const codeVerifier = crypto.randomBytes(64).toString("hex")
	const sha256 = crypto
		.createHash("sha256")
		.update(codeVerifier)
		.digest("base64")
	const codeChallenge = base64url.fromBase64(sha256)

	const oauthUrl = `${twitterUrl}?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${flatScope}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`

	return oauthUrl
}
