resource "aws_lambda_function" "twitter_authorisation_lambda" {
  filename         = "../authorisation-lambda/authorisation-lambda.zip"
  function_name    = var.authorisation_lambda_function_name
  role             = aws_iam_role.iam_role_authorisation_lambda.arn
  handler          = "index.handler"
  source_code_hash = filebase64sha256("../authorisation-lambda/authorisation-lambda.zip")
  runtime          = "nodejs14.x"
  timeout          = 60
}
