variable "auth-lambda-name" {
  description = "authorisation lambda function name"
  type        = string
  default     = "twitter-auth-lambda"
}

variable "AWS_ACCESS_KEY_ID" {
  description = "AWS access key to be stored in lambda environments"
  type        = string
  sensitive   = true
}

variable "AWS_SECRET_KEY" {
  description = "AWS secret key to be stored in lambda environments"
  type        = string
  sensitive   = true
}

variable "AWS_REGION" {
  description = "AWS region"
  type        = string
  default     = "eu-west-2"
}
