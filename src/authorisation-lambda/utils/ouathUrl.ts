import "dotenv/config"
import crypto from "crypto"
import base64url from "base64url"

interface OAuth {
	state: string
	codeVerifier: string
	oauthUrl: string
}

export const generateUrl = (
	clientId: string,
	redirectUri: string,
	scope: string[]
): OAuth => {
	const twitterUrl = "https://twitter.com/i/oauth2/authorize"
	const flatScope = scope.join("%20")

	const responseType = "code"
	const codeChallengeMethod = "S256"
	const state = crypto.randomBytes(64).toString("hex")

	const codeVerifier = crypto.randomBytes(64).toString("hex")
	const codeVerifierHash = crypto
		.createHash("sha256")
		.update(codeVerifier)
		.digest("base64")
	const codeChallenge = base64url.fromBase64(codeVerifierHash)

	const oauthUrl = `${twitterUrl}?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${flatScope}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`

	return { state, codeVerifier, oauthUrl }
}
