import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';

const backupUserpoolId = '{fill:userpoolid}';
const stageName = 'sample';
const backupFilePrefix = 'userpoolbackup';
const backedUpDataFileName = 'userpoolbackup-sample-{fill:userpoolid}';
const localProfileName = 'kendra-geoseong'; // default: 'default'

const creds = new AWS.SharedIniFileCredentials({ profile: localProfileName });
AWS.config.region = 'us-west-2';
AWS.config.credentials = creds;
const cognitoIdp = new AWS.CognitoIdentityServiceProvider();

type UserType = AWS.CognitoIdentityServiceProvider.UserType;
type ListUsersRequestTypes = AWS.CognitoIdentityServiceProvider.Types.ListUsersRequest;
type ListUsersResponseType = AWS.CognitoIdentityServiceProvider.UsersListType;
type AdminCreateUserRequest = AWS.CognitoIdentityServiceProvider.Types.AdminCreateUserRequest;
type AttributeType = AWS.CognitoIdentityServiceProvider.Types.AttributeType;

const backupUserpoolData = async (
  userData: ListUsersResponseType,
  params: ListUsersRequestTypes,
): Promise<ListUsersResponseType> => {
  const {
    Users = [] as UserType[],
    PaginationToken,
  } = await cognitoIdp.listUsers(params).promise();

  const existingUserData = userData;
  const newUserData = [...existingUserData, ...Users] as ListUsersResponseType;

  if (PaginationToken) {
    return await backupUserpoolData(newUserData, {
      UserPoolId: params.UserPoolId,
      PaginationToken: params.PaginationToken,
    });
  } else {
    return newUserData;
  }
};

const resetPasswordByAdmin = async () => {
  // list
  const userdata = await backupUserpoolData([] as UserType[], {
    UserPoolId: backupUserpoolId,
  });

  // // user list: save to file
  // const file = path.join('/', `${stageName}-${backupUserpoolId}.json`);
  // fs.writeFileSync(
  //   `${backupFilePrefix}-${stageName}-${backupUserpoolId}.json`,
  //   JSON.stringify(userdata, null, 2),
  // );
  // return;

  for (let i = 0; i < userdata.length; i++) {
    const user = userdata[i];
    if (
      !user.Attributes ||
      !user.Username ||
      user.UserStatus !== 'FORCE_CHANGE_PASSWORD'
    ) {
      console.log('[not FORCE_CHANGE_PASSWORD] continue');
      continue;
    }

    let Username: string = `NewUsername-${i}`;
    const UserAttributes: AttributeType[] = [];

    if (user.UserStatus) {
      const params = {
        Password: '!234Qwer' /* required */,
        UserPoolId: UserpoolId /* required */,
        Username: user.Username /* required */,
      };
      const result = await cognitoIdp.adminSetUserPassword(params).promise();
      console.log(JSON.stringify(result, null, 2));
    }
  } // end for
};

resetPasswordByAdmin();
