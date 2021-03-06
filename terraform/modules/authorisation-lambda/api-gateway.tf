resource "aws_apigatewayv2_api" "twitter-auth-api-gateway" {
  name          = "twitter-auth-api-gateway"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "twitter-auth-api-gateway-stage" {
  api_id      = aws_apigatewayv2_api.twitter-auth-api-gateway.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "twitter-auth-api-gateway-lambda-integration" {
  api_id                 = aws_apigatewayv2_api.twitter-auth-api-gateway.id
  integration_type       = "AWS_PROXY"
  description            = "Lambda integration for twitter-auth"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.twitter-authorisation-lambda.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "twitter-auth-api-gateway-authorise-route" {
  api_id             = aws_apigatewayv2_api.twitter-auth-api-gateway.id
  route_key          = "GET /authorise"
  target             = "integrations/${aws_apigatewayv2_integration.twitter-auth-api-gateway-lambda-integration.id}"
  authorization_type = "AWS_IAM"
}

resource "aws_apigatewayv2_route" "twitter-auth-api-gateway-token-route" {
  api_id             = aws_apigatewayv2_api.twitter-auth-api-gateway.id
  route_key          = "GET /token"
  target             = "integrations/${aws_apigatewayv2_integration.twitter-auth-api-gateway-lambda-integration.id}"
  authorization_type = "NONE"
}

resource "aws_apigatewayv2_route" "twitter-auth-api-gateway-refresh-route" {
  api_id             = aws_apigatewayv2_api.twitter-auth-api-gateway.id
  route_key          = "GET /refresh"
  target             = "integrations/${aws_apigatewayv2_integration.twitter-auth-api-gateway-lambda-integration.id}"
  authorization_type = "AWS_IAM"
}
