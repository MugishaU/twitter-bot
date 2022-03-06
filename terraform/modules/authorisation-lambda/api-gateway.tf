resource "aws_apigatewayv2_api" "twitter-auth-api-gateway-terraform" {
  name          = "twitter-auth-api-gateway-terraform"
  protocol_type = "HTTP"
}


resource "aws_apigatewayv2_stage" "twitter-auth-api-gateway-stage" {
  api_id      = aws_apigatewayv2_api.twitter-auth-api-gateway-terraform.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "twitter-auth-api-gateway-lambda-integration" {
  api_id           = aws_apigatewayv2_api.twitter-auth-api-gateway-terraform.id
  integration_type = "AWS_PROXY"

  description            = "Lambda integration"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.twitter-authorisation-lambda.invoke_arn
  payload_format_version = "2.0"
}
