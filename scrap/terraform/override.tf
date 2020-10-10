
resource "aws_lambda_function" "api_handler" {
  environment {
    variables = local.variables
  }
}


resource "aws_lambda_function" "ddb_operator" {
  environment {
    variables = local.variables

  }
  timeout = 900
}


resource "aws_lambda_function" "worker_handler" {
  environment {
    variables = local.variables
  }
  timeout = 540
}

