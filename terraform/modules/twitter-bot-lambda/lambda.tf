resource "aws_lambda_function" "twitter-bot-lambda" {
  filename      = "../src/twitter-bot-lambda/twitter-bot-lambda.zip"
  function_name = var.lambda-name
  role          = aws_iam_role.iam-role-twitter-bot-lambda.arn
  handler       = "index.handler"
  runtime       = "nodejs14.x"
  timeout       = 60
}

resource "aws_lambda_permission" "eventbridge-lambda-permission" {
  statement_id  = "EventbridgeToLambda"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.twitter-bot-lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:events:eu-west-2:${data.aws_caller_identity.current.account_id}:rule/twitter*"
}
