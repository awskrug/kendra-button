export AWS_DEFAULT_REGION=us-west-2
export CHALICE_STAGE=prod
chalice package --pkg-format terraform --stage prod ./terraform/
cd terraform && terraform workspace select prod && terraform apply && cd ..