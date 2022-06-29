data "aws_caller_identity" "current" {}

resource "aws_iam_role" "iam-role-authorisation-lambda" {
  name               = "iam-role-authorisation-lambda"
  assume_role_policy = data.aws_iam_policy_document.authorisation_lambda_role.json
}

data "aws_iam_policy_document" "authorisation_lambda_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }

}

resource "aws_iam_policy_attachment" "cloudwatch-policy-attachment" {
  name       = "twitter-authorisation-cloudwatch"
  roles      = [aws_iam_role.iam-role-authorisation-lambda.name]
  policy_arn = aws_iam_policy.cloudwatch-policy.arn
}

resource "aws_iam_policy" "cloudwatch-policy" {
  name   = "twitter-authorisation-cloudwatch"
  policy = data.aws_iam_policy_document.cloudwatch-policy-document.json
}

data "aws_iam_policy_document" "cloudwatch-policy-document" {
  statement {
    sid       = "CreateLogGroup"
    effect    = "Allow"
    actions   = ["logs:CreateLogGroup"]
    resources = ["arn:aws:logs:eu-west-2:${data.aws_caller_identity.current.account_id}:*"]
  }

  statement {
    sid       = "PutMetricData"
    effect    = "Allow"
    actions   = ["cloudwatch:PutMetricData"]
    resources = ["*"]
  }

  statement {
    sid     = "CreateLogStreamAndPutEvents"
    effect  = "Allow"
    actions = ["logs:CreateLogStream", "logs:PutLogEvents"]
    resources = [
      "arn:aws:logs:eu-west-2:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${var.auth-lambda-name}:*"
    ]
  }
}

resource "aws_iam_policy_attachment" "invoke-api-gateway-policy-attachment" {
  name       = "invoke-api-gateway"
  roles      = [var.twitter-bot-lambda-iam-role-name]
  policy_arn = aws_iam_policy.invoke-api-gateway-policy.arn
}

resource "aws_iam_policy" "invoke-api-gateway-policy" {
  name   = "invoke-api-gateway-policy"
  policy = data.aws_iam_policy_document.invoke-api-policy-document.json
}

data "aws_iam_policy_document" "invoke-api-policy-document" {
  statement {
    sid       = "InvokeAPIGateway"
    effect    = "Allow"
    actions   = ["execute-api:Invoke"]
    resources = ["${aws_apigatewayv2_api.twitter-auth-api-gateway.execution_arn}/*"]
  }
}
