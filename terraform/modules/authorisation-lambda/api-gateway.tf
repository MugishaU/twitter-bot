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
  api_id                 = aws_apigatewayv2_api.twitter-auth-api-gateway-terraform.id
  integration_type       = "AWS_PROXY"
  description            = "Lambda integration"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.twitter-authorisation-lambda.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "twitter-auth-api-gateway-authorise-route" {
  api_id    = aws_apigatewayv2_api.twitter-auth-api-gateway-terraform.id
  route_key = "GET /authorise"
  target    = "integrations/${aws_apigatewayv2_integration.twitter-auth-api-gateway-lambda-integration.id}"
}

resource "aws_apigatewayv2_route" "twitter-auth-api-gateway-callback-route" {
  api_id    = aws_apigatewayv2_api.twitter-auth-api-gateway-terraform.id
  route_key = "POST /callback"
  target    = "integrations/${aws_apigatewayv2_integration.twitter-auth-api-gateway-lambda-integration.id}"
}

resource "aws_apigatewayv2_route" "twitter-auth-api-gateway-token-route" {
  api_id    = aws_apigatewayv2_api.twitter-auth-api-gateway-terraform.id
  route_key = "POST /token"
  target    = "integrations/${aws_apigatewayv2_integration.twitter-auth-api-gateway-lambda-integration.id}"
}

resource "aws_apigatewayv2_route" "twitter-auth-api-gateway-refresh-route" {
  api_id    = aws_apigatewayv2_api.twitter-auth-api-gateway-terraform.id
  route_key = "POST /refresh"
  target    = "integrations/${aws_apigatewayv2_integration.twitter-auth-api-gateway-lambda-integration.id}"
}
