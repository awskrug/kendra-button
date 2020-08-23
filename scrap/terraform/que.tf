
resource "aws_sqs_queue" "page_que" {
  name = " kendra-btns-page-que-${data.null_data_source.chalice.inputs.stage}"
}