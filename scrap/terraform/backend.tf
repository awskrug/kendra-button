terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "kendra-buttons"

    workspaces {
      prefix = "kendra_btns_"
    }
  }
}
