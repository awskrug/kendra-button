resource "aws_secretsmanager_secret" "secrets" {
  name = "kendera-btn/${data.null_data_source.chalice.inputs.stage}/query-api"
}