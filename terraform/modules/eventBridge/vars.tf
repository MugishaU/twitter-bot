variable "query" {
  description = "Query term to search twitter for"
}

variable "lambda-arn" {
  description = "The arn of the lambda to trigger"
}

variable "function_name" {
  description = "The name of the lambda funtion to trigger"
}

variable "schedule_expression" {
  description = "The cron schedule the rule should run on"
}
