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

const restoreUserpoolData = async (
  userdata: ListUsersResponseType,
  UserPoolId: string,
) => {
  // const { UserPool } = await cognitoIdp
  //   .describeUserPool({ UserPoolId })
  //   .promise();
  // console.log('UserPool', JSON.stringify(UserPool, null, 2));

  for (let i = 0; i < userdata.length; i++) {
    const user = userdata[i];
    if (!user.Attributes || !user.Username) {
      continue;
    }

    let Username: string = `NewUsername-${i}`;
    const UserAttributes: AttributeType[] = [];
    user.Attributes.forEach((attr: AttributeType) => {
      if (!attr.Value || attr.Name === 'sub' || attr.Name === 'identities')
        return;
      if (attr.Name === 'email') {
        Username = attr.Value;
      }
      UserAttributes.push(attr);
    });

    const params: AdminCreateUserRequest = {
      UserPoolId,
      Username,
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes,
      MessageAction: 'SUPPRESS',
      TemporaryPassword: 'kendra-button',
      ClientMetadata: {
        restore: 'Y',
      },
    };

    try {
      await cognitoIdp.adminCreateUser(params).promise();
    } catch (e) {
      console.log('error:', e);
      if (e.code === 'UsernameExistsException') {
        console.log(
          `Looks like user ${user.Username} already exists, ignoring.`,
        );
      } else {
        throw e;
      }
    }
  }
};

/*
[backup/restore]
backup Userpool -> target Userpool
*/
const backupAndRestore = async (UserPoolId: string) => {
  const userdata = await backupUserpoolData({
    userData: [] as UserType[],
    params: {
      UserPoolId,
    },
  });
  // file 저장
  //   const file = path.join('/', `dev-${devUserpoolId}.json`);
  //   fs.writeFileSync(
  //     `${backupfilePrefix}-prod-${devUserpoolId}.json`,
  //     JSON.stringify(userdata, null, 2),
  //   );

  await restoreUserpoolData(userdata, UserPoolId);
};

backupAndRestore(prodUserpoolId);
