

resource "aws_lambda_function" "api_handler" {
  environment {
    variables = {
      siteDB = aws_dynamodb_table.site_db.name
      pageDB = aws_dynamodb_table.page_db.name
      SQS = aws_sqs_queue.page_que.name
      KENDRA_ROLE = local.kendra_role_arn
      PYPPETEER_HOME = "/tmp/"
      CHALICE_STAGE = data.null_data_source.chalice.inputs.stage
    }
  }
}

