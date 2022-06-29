variable "authorisation-lambda-iam-role-name" {
  description = "authorisation lambda IAM role name"
  type        = string
  default     = "iam-role-authorisation-lambda"
}

variable "twitter-bot-lambda-iam-role-name" {
  description = "twitter bot lambda lambda IAM role name"
  type        = string
  default     = "iam-role-twitter-bot-lambda"
}
