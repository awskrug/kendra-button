variable "kendra_account" {
  description = "kendra deploy account"
  default = "294038372338"
}


data "aws_sqs_queue" "page_que_info" {
  name = aws_sqs_queue.page_que.name
  depends_on = [
    aws_sqs_queue.page_que
  ]
}

locals {
  variables = {
    S3 = "kendra-buttons-everypython-store-dev"
    siteDB = aws_dynamodb_table.site_db.name
    pageDB = aws_dynamodb_table.page_db.name
    pageQueUrl = data.aws_sqs_queue.page_que_info.url
    secrets = aws_secretsmanager_secret.secrets.name
    PYPPETEER_HOME = "/tmp/"
    CHALICE_STAGE = data.null_data_source.chalice.inputs.stage
  }
}