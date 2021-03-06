resource "aws_dynamodb_table" "site_db" {
  name = "kendra-btns-site-db${data.null_data_source.chalice.inputs.stage}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "user"
  range_key = "site_id"

  attribute {
    name = "user"
    type = "S"
  }

  attribute {
    name = "site_id"
    type = "S"
  }

  tags = {
    Project = "kendra-button"
  }
}

resource "aws_dynamodb_table" "page_db" {
  name = "kendra-btns-page-db${data.null_data_source.chalice.inputs.stage}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "site_id"
  range_key = "url"

  attribute {
    name = "site_id"
    type = "S"
  }

  attribute {
    name = "url"
    type = "S"
  }

  attribute {
    name = "user"
    type = "S"
  }


  stream_enabled = true
  stream_view_type = "NEW_AND_OLD_IMAGES"
  tags = {
    Project = "kendra-button"
  }
  global_secondary_index {
    name = "user_by_site"
    hash_key = "user"
    range_key = "site_id"
    projection_type = "ALL"
  }
}

resource "aws_lambda_event_source_mapping" "page_stream" {
  event_source_arn = aws_dynamodb_table.page_db.stream_arn
  function_name = aws_lambda_function.ddb_operator.function_name
  starting_position = "LATEST"
}