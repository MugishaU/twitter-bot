resource "aws_dynamodb_table" "twitter-auth-db" {
  name         = "twitter-auth"
  hash_key     = "id"
  billing_mode = "PAY_PER_REQUEST"

  ttl {
    enabled        = true
    attribute_name = "ttl"
  }

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "twitter-history-db" {
  name         = "twitter-history"
  hash_key     = "id"
  billing_mode = "PAY_PER_REQUEST"

  ttl {
    enabled        = true
    attribute_name = "ttl"
  }

  attribute {
    name = "id"
    type = "S"
  }
}
