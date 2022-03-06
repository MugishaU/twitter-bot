# data "aws_caller_identity" "current" {}

resource "aws_lambda_function" "twitter-authorisation-lambda" {
  filename         = "../authorisation-lambda/authorisation-lambda.zip"
  function_name    = var.auth-lambda-name
  role             = aws_iam_role.iam-role-authorisation-lambda.arn
  handler          = "index.handler"
  source_code_hash = filebase64sha256("../authorisation-lambda/authorisation-lambda.zip")
  runtime          = "nodejs14.x"
  timeout          = 60
}

resource "aws_lambda_permission" "api-gateway-lambda-permission" {
  statement_id  = "APIGatewayToLambda"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.twitter-authorisation-lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:eu-west-2:${data.aws_caller_identity.current.account_id}:${aws_apigatewayv2_api.twitter-auth-api-gateway-terraform.id}/*/*/*"
}
