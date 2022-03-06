resource "aws_lambda_function" "twitter-authorisation-lambda" {
  filename         = "../authorisation-lambda/authorisation-lambda.zip"
  function_name    = var.auth-lambda-name
  role             = aws_iam_role.iam-role-authorisation-lambda.arn
  handler          = "index.handler"
  source_code_hash = filebase64sha256("../authorisation-lambda/authorisation-lambda.zip")
  runtime          = "nodejs14.x"
  timeout          = 60
}
