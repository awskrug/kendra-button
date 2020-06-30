// import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';

const AWS = require('aws-sdk');
const cognitoIdp = new AWS.CognitoIdentityServiceProvider();

const getUserByEmail = async (userPoolId, email) => {
  const params = {
    UserPoolId: userPoolId,
    Filter: `email = "${email}"`,
  };
  return cognitoIdp.listUsers(params).promise();
};

const linkProviderToUser = async (userPoolId, providerName, providerUserId) => {
  const params = {
    DestinationUser: {
      // ProviderAttributeValue: username, // native(sign up directly)_users
      ProviderAttributeValue: providerUserId, // federated_users
      ProviderName: 'Cognito',
    },
    SourceUser: {
      ProviderAttributeName: 'Cognito_Subject',
      ProviderAttributeValue: providerUserId,
      ProviderName: providerName,
    },
    UserPoolId: userPoolId,
  };

  const result = await new Promise((resolve, reject) => {
    cognitoIdp.adminLinkProviderForUser(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
  return result;
};

const disableProviderForUser = async (
  userPoolId,
  providerName,
  providerUserId,
) => {
  const params = {
    User: {
      ProviderAttributeName: 'Cognito_Subject',
      ProviderAttributeValue: providerUserId,
      ProviderName: providerName,
    },
    UserPoolId: userPoolId,
  };

  const result = await new Promise((resolve, reject) => {
    cognitoIdp.adminDisableProviderForUser(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
  return result;
};

exports.handler = async (event, context, callback) => {
  const userRs = await getUserByEmail(
    event.userPoolId,
    event.request.userAttributes.email,
  );

  console.log('userRs', JSON.stringify(userRs, null, 2));
  console.log('event.userName', event.userName);

  if (userRs && userRs.Users.length > 0) {
    const user = userRs.Users[0];

    if (user.UserStatus !== 'EXTERNAL_PROVIDER') {
      const [providerName, providerUserId] = event.userName.split('_'); // event userName example: "Facebook_12324325436"
      await linkProviderToUser(event.userPoolId, providerName, providerUserId);
    } else {
      const [providerName, providerUserId] = user.Username.split('_'); // event userName example: "Facebook_12324325436"
      await disableProviderForUser(
        event.userPoolId,
        providerName,
        providerUserId,
      );
    }
  } else {
    console.log('user not found, skip.');
  }

  callback(null, event);
};
