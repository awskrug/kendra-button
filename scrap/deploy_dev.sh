export AWS_DEFAULT_REGION=us-west-2
chalice package --pkg-format terraform --stage dev ./terraform/
cd terraform && terraform workspace select dev && terraform apply && cd ..