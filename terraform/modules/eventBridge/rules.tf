resource "aws_cloudwatch_event_rule" "cron-job" {
  name_prefix         = "twitter-search-"
  description         = "Twitter bot search term: ${var.query}"
  schedule_expression = var.schedule_expression
}

resource "aws_cloudwatch_event_target" "cron-json" {
  rule  = aws_cloudwatch_event_rule.cron-job.name
  arn   = var.lambda-arn
  input = jsonencode({ "query" : "${var.query}" })
}

resource "aws_lambda_permission" "lambda-trigger" {
  statement_id_prefix = "lambda-trigger-"
  action              = "lambda:InvokeFunction"
  function_name       = var.function_name
  principal           = "events.amazonaws.com"
  source_arn          = aws_cloudwatch_event_rule.cron-job.arn
}
