data "aws_caller_identity" "current" {}

resource "aws_iam_group" "dynamoDB-read-write-access" {
  name = "twitter-dynamoDB-read-write-access"
}

resource "aws_iam_group_policy" "dynamoDB-read-write-accesspolicy" {
  name   = "dynamoDB-read-write-access-policy"
  group  = aws_iam_group.dynamoDB-read-write-access.name
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
