resource "aws_cloudwatch_log_group" "twitter-auth-cloudwatch" {
  name              = "/aws/lambda/twitter-bot-lambda"
  retention_in_days = 30
}
