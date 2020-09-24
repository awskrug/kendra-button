resource "aws_iam_policy" "lambda_policy" {
  name        = "kendra_lambda_policy_${data.null_data_source.chalice.inputs.stage}"
  description = "kendra lambda resource access policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:*",
        "s3:*",
        "sns:*",
        "sqs:*",
        "cloudwatch:*",
        "events:*",
        "secretsmanager:*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "test-attach" {
  role       = aws_iam_role.default-role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}