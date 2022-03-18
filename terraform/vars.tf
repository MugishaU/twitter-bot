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
