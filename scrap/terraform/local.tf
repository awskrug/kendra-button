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