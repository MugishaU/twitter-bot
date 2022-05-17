output "arn" {
  value = aws_lambda_function.twitter-bot-lambda.arn
}

output "name" {
  value = aws_lambda_function.twitter-bot-lambda.function_name
}
