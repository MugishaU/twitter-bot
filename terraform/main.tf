terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  cloud {
    organization = "mugishau"

    workspaces {
      name = "twitter-bot"
    }
  }

  required_version = "= 1.1.6"
}

provider "aws" {
  profile = "default"
  region  = "eu-west-2"
}

module "authorisation-lambda" {
  source            = "./modules/authorisation-lambda"
  AWS_ACCESS_KEY_ID = var.AWS_ACCESS_KEY_ID
  AWS_SECRET_KEY    = var.AWS_SECRET_KEY
}

module "dynamoDB" {
  source = "./modules/dynamoDB"
}
