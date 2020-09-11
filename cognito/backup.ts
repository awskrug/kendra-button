import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';

const devUserpoolId = 'us-west-2_XT1s3RtPp';
const prodUserpoolId = 'us-west-2_pdulBxv2r';
const backupfilePrefix = 'userpoolbackup';

const localProfileName = 'kendra-geoseong';

const creds = new AWS.SharedIniFileCredentials({ profile: localProfileName });
AWS.config.region = 'us-west-2';
AWS.config.credentials = creds;
const cognitoIdp = new AWS.CognitoIdentityServiceProvider();

type CognitoISP = AWS.CognitoIdentityServiceProvider;
type UserType = AWS.CognitoIdentityServiceProvider.UserType;
type ListUsersRequestTypes = AWS.CognitoIdentityServiceProvider.Types.ListUsersRequest;
type ListUsersResponseType = AWS.CognitoIdentityServiceProvider.UsersListType;
type AdminCreateUserRequest = AWS.CognitoIdentityServiceProvider.Types.AdminCreateUserRequest;
type AttributeType = AWS.CognitoIdentityServiceProvider.Types.AttributeType;

interface BackupReqProp {
  userData: ListUsersResponseType;
  params: ListUsersRequestTypes;
}
const backupUserpoolData = async (
  backupReqProp: BackupReqProp,
): Promise<ListUsersResponseType> => {
  const {
    Users = [] as UserType[],
    PaginationToken,
  } = await cognitoIdp.listUsers(backupReqProp.params).promise();

  const existingUserData = backupReqProp.userData;
  const newUserData = [...existingUserData, ...Users] as ListUsersResponseType;

  if (PaginationToken) {
    return await backupUserpoolData({
      userData: newUserData,
      params: {
        UserPoolId: backupReqProp.params.UserPoolId,
        PaginationToken: backupReqProp.params.PaginationToken,
      },
    });
  } else {
    /* Userpool의 Users[] 을 리턴 */
    return newUserData;
  }
};

// const restoreUserpoolData = async (UserPoolId: string) => {
//   const { UserPool } = await cognitoIdp
//     .describeUserPool({ UserPoolId })
//     .promise();
//   console.log('UserPool', JSON.stringify(UserPool, null, 2));

//   const params: AdminCreateUserRequest = {
//     UserPoolId,
//     Username: user.Username,
//     UserAttributes: attributes,
//   };
// };
/*
[backup/restore]
backup Userpool -> target Userpool
*/
backupUserpoolData({
  userData: [] as UserType[],
  params: {
    UserPoolId: prodUserpoolId,
  },
}).then((userdata: ListUsersResponseType) => {
  console.log('backup userinfo', JSON.stringify(userdata, null, 2));
  // file 저장
  const file = path.join('/', `dev-${devUserpoolId}.json`);
  fs.writeFileSync(
    `${backupfilePrefix}-prod-${devUserpoolId}.json`,
    JSON.stringify(userdata, null, 2),
  );
});

// restoreUserpoolData(prodUserpoolId);
