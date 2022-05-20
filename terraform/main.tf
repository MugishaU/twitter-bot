module "authorisation-lambda" {
  source        = "./modules/authorisation-lambda"
  CLIENT_SECRET = var.CLIENT_SECRET
}

module "twitter-bot-lambda" {
  source = "./modules/twitter-bot-lambda"
}

module "dynamoDB" {
  source = "./modules/dynamoDB"
}

module "eventBridgeRule0" {
  source              = "./modules/eventBridge"
  query               = "%23BlackInTech apply now -is:retweet"
  function_name       = module.twitter-bot-lambda.name
  lambda-arn          = module.twitter-bot-lambda.arn
  schedule_expression = "cron(00 12 * * ? *)"
}

module "eventBridgeRule1" {
  source              = "./modules/eventBridge"
  query               = "%23BlackTechTwitter apply now -is:retweet"
  function_name       = module.twitter-bot-lambda.name
  lambda-arn          = module.twitter-bot-lambda.arn
  schedule_expression = "cron(00 15 * * ? *)"
}

module "eventBridgeRule2" {
  source              = "./modules/eventBridge"
  query               = "%23BlackWomenInTech apply now -is:retweet"
  function_name       = module.twitter-bot-lambda.name
  lambda-arn          = module.twitter-bot-lambda.arn
  schedule_expression = "cron(00 18 * * ? *)"
}
