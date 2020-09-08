// const AWS = require('aws-sdk');

import * as AWS from 'aws-sdk';
const cognitoIdp = new AWS.CognitoIdentityServiceProvider();

type CognitoISP = AWS.CognitoIdentityServiceProvider;
type ListUsersRequestTypes = AWS.CognitoIdentityServiceProvider.Types.ListUsersRequest;
type AdminCreateUserRequest = AWS.CognitoIdentityServiceProvider.Types.AdminCreateUserRequest;
type AttributeType = AWS.CognitoIdentityServiceProvider.Types.AttributeType;

const getUserByEmail = async (userPoolId, email) => {
  const params = {
    UserPoolId: userPoolId,
    Filter: `email = "${email}"`,
  };
  return cognitoIdp.listUsers(params).promise();
};

const userRs = await getUserByEmail(
  event.userPoolId,
  event.request.userAttributes.email,
);
const params: ListUsersRequestTypes = {
  UserPoolId: poolId,
};

const paginationCalls = async () => {
  const { Users = [], PaginationToken } = await cognito
    .listUsers(params)
    .promise();
  Users.forEach((user) => stringify.write(user as string));

  if (PaginationToken) {
    params.PaginationToken = PaginationToken;
    if (delayDurationInMillis > 0) {
      await delay(delayDurationInMillis);
    }
    await paginationCalls();
  }
};
