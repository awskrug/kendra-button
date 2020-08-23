resource "aws_dynamodb_table" "site_db" {
  name           = "kendra-btns-site-db${data.null_data_source.chalice.inputs.stage}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "user"
  range_key = "site"

  attribute {
    name = "user"
    type = "S"
  }

  attribute {
    name = "site"
    type = "S"
  }

  tags = {
    Project        = "kendra-button"
  }
}

resource "aws_dynamodb_table" "page_db" {
  name           = "kendra-btns-page-db${data.null_data_source.chalice.inputs.stage}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "site"
  range_key = "url"

  attribute {
    name = "site"
    type = "S"
  }

  attribute {
    name = "url"
    type = "S"
  }

  tags = {
    Project        = "kendra-button"
  }
}