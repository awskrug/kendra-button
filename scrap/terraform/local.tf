variable "kendra_account" {
  description = "kendra deploy account"
  default = "294038372338"
}

locals {
  kendra_role = "kendra-buttons-put-doc-role-${data.null_data_source.chalice.inputs.stage}"

}
locals {
  kendra_role_arn = "arn:aws:iam::${var.kendra_account}:role/${local.kendra_role}"
}


data "aws_sqs_queue" "page_que_info" {
  name = aws_sqs_queue.page_que.name
  depends_on = [
    aws_sqs_queue.page_que
  ]
}

locals {
  variables = {
    S3 = "kendra-button-data"
    siteDB = aws_dynamodb_table.site_db.name
    pageDB = aws_dynamodb_table.page_db.name
    pageQueUrl = data.aws_sqs_queue.page_que_info.url
    KENDRA_ROLE = local.kendra_role_arn
    PYPPETEER_HOME = "/tmp/"
    CHALICE_STAGE = data.null_data_source.chalice.inputs.stage
  }
}