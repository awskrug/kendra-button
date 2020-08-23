#docker run -v "$(PWD)"/vendor:/var/task "lambci/lambda:build-python3.8" /bin/sh -c "pip install -r requirements.txt -t /var/task; exit"
export AWS_DEFAULT_REGION=us-west-2
export CHALICE_STAGE=dev
chalice package --pkg-format terraform ./terraform/
cd terraform && terraform workspace select dev && terraform apply && cd ..