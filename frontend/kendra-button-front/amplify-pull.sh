#!/usr/bin/env bash

AMPLIFY="'{\
\"projectName\":\"${PROJECT_NAME}\",\
\"appId\":\"${AWS_APP_ID}\",\
\"envName\":\"${ENV_NAME}\",\
\"defaultEditor\":\"code\"\
}'"
AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":false,\
\"profileName\":\"default\",\
\"accessKeyId\":\"${ACCESS_KEY_ID}\",\
\"secretAccessKey\":\"${SECRET_ACCESS_KEY}\",\
\"region\":\"${REGION}\"\
}"
PROVIDERS="'{\
\"awscloudformation\":${AWSCLOUDFORMATIONCONFIG}\
}'"

cmd="amplify pull --amplify ${AMPLIFY} --providers ${PROVIDERS} --yes"
echo $cmd
eval $cmd