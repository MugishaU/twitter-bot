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

module "eventBridgeRule1" {
  source              = "./modules/eventBridge"
  query               = "%23BlackInTech apply -is:retweet"
  function_name       = module.twitter-bot-lambda.name
  lambda-arn          = module.twitter-bot-lambda.arn
  schedule_expression = "cron(00 06 * * ? *)"
}

module "eventBridgeRule2" {
  source              = "./modules/eventBridge"
  query               = "%23BlackTechTwitter apply -is:retweet"
  function_name       = module.twitter-bot-lambda.name
  lambda-arn          = module.twitter-bot-lambda.arn
  schedule_expression = "cron(00 09 * * ? *)"
}

module "eventBridgeRule3" {
  source              = "./modules/eventBridge"
  query               = "%23BlackWomenInTech apply -is:retweet"
  function_name       = module.twitter-bot-lambda.name
  lambda-arn          = module.twitter-bot-lambda.arn
  schedule_expression = "cron(00 12 * * ? *)"
}

module "eventBridgeRule4" {
  source              = "./modules/eventBridge"
  query               = "apply from:codingblackfems -is:retweet"
  function_name       = module.twitter-bot-lambda.name
  lambda-arn          = module.twitter-bot-lambda.arn
  schedule_expression = "cron(00 15 * * ? *)"
}

module "eventBridgeRule5" {
  source              = "./modules/eventBridge"
  query               = "apply from:codefirstgirls -is:retweet"
  function_name       = module.twitter-bot-lambda.name
  lambda-arn          = module.twitter-bot-lambda.arn
  schedule_expression = "cron(00 18 * * ? *)"
}

module "eventBridgeRule6" {
  source              = "./modules/eventBridge"
  query               = "apply from:btpipeline -is:retweet"
  function_name       = module.twitter-bot-lambda.name
  lambda-arn          = module.twitter-bot-lambda.arn
  schedule_expression = "cron(00 21 * * ? *)"
}
