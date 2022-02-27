data "aws_caller_identity" "current" {}

resource "aws_iam_role" "iam_role_authorisation_lambda" {
  name               = "iam_for_authorisation_lambda"
  assume_role_policy = data.aws_iam_policy_document.authorisation_lambda_role.json
}

data "aws_iam_policy_document" "authorisation_lambda_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}
