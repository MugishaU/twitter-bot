terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  required_version = "= 1.1.6"
}

provider "aws" {
  profile = "default"
  region  = "eu-west-2"
}

module "authorisation-lambda" {
  source = "./modules/authorisation-lambda"
}
