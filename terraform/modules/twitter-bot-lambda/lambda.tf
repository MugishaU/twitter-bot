resource "aws_lambda_function" "twitter-bot-lambda" {
  filename      = "../src/twitter-bot-lambda/twitter-bot-lambda.zip"
  function_name = var.lambda-name
  role          = aws_iam_role.iam-role-twitter-bot-lambda.arn
  handler       = "index.handler"
  runtime       = "nodejs14.x"
  timeout       = 60
}
