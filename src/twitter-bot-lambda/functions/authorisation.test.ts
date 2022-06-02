import { getToken, refreshToken } from "./authorisation";

//getToken
//Access is successful & ttl is valid
//Access is successful & ttl is invalid && refesh works
//Access is successful & ttl is invalid && refresh fails
//Access is not successful

//refreshToken
//Refresh is successful
//Refresh is not successful with defined error
//Refresh is not successful with undefined error