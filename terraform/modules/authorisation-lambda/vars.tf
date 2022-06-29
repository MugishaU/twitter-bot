variable "auth-lambda-name" {
  description = "authorisation lambda function name"
  type        = string
  default     = "twitter-auth-lambda"
}

variable "twitter-bot-lambda-iam-role-name" {
  description = "twitter bot lambda lambda IAM role name"
  type        = string
  default     = "iam-role-twitter-bot-lambda"
}

variable "CLIENT_SECRET" {
  description = "The client secret used as the basic auth password for Twitter API calls"
  sensitive   = true
}
