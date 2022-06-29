data "aws_caller_identity" "current" {}

resource "aws_iam_policy_attachment" "dynamoDB-read-write-access-policy-attachment" {
  name       = "dynamoDB-read-write-access"
  roles      = [var.authorisation-lambda-iam-role-name, var.twitter-bot-lambda-iam-role-name]
  policy_arn = aws_iam_policy.dynamoDB-read-write-access-policy.arn
}

resource "aws_iam_policy" "dynamoDB-read-write-access-policy" {
  name   = "dynamoDB-read-write-access-policy"
  policy = data.aws_iam_policy_document.dynamoDB-read-write-access-policy-document.json
}

data "aws_iam_policy_document" "dynamoDB-read-write-access-policy-document" {
  statement {
    sid       = "AccessTwitterDynamoDB"
    effect    = "Allow"
    actions   = ["dynamodb:GetItem", "dynamodb:PutItem"]
    resources = ["arn:aws:dynamodb:eu-west-2:${data.aws_caller_identity.current.account_id}:table/twitter*"]
  }
}
