resource "aws_cloudwatch_log_group" "twitter-auth-cloudwatch" {
  name              = "/aws/lambda/twitter-auth-lambda"
  retention_in_days = 30
}
