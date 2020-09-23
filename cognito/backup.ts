import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';

// START: "yarn start" 실행 하기 전 파라미터 값을 원하는 대로 수정
const backupUserpoolId = 'us-west-2_rtftALkqJ';
const restoreUserpoolId = 'us-west-2_kPvJLjiXE';
const stageName = 'sample';
const backupFilePrefix = 'userpoolbackup';
const backedUpDataFileName = 'userpoolbackup-sample-us-west-2_rtftALkqJ';
const localProfileName = 'kendra-geoseong'; // default: 'default'
const tempPassword = 'kendra-button';
// END: "yarn start" 실행 하기 전 파라미터 값을 원하는 대로 수정

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

const restoreUserpoolData = async (
  userdata: ListUsersResponseType,
  UserPoolId: string,
) => {
  for (let i = 0; i < userdata.length; i++) {
    const user = userdata[i];
    if (!user.Attributes || !user.Username) {
      console.log('[restoreUserpoolData] continue');
      continue;
    }

    let Username: string = `NewUsername-${i}`;
    const UserAttributes: AttributeType[] = [];

    // TODO: why don't async?
    // for (let i = 0; i < user.Attributes.length; i++) {
    //   const attr = user.Attributes[i];
    //   if (!attr.Value || attr.Name === 'sub' || attr.Name === 'identities')
    //     return;
    //   if (attr.Name === 'email') {
    //     Username = attr.Value;
    //   }
    //   UserAttributes.push(attr);
    // }

    user.Attributes.forEach((attr: AttributeType) => {
      if (!attr.Value || attr.Name === 'sub' || attr.Name === 'identities')
        return;
      if (attr.Name === 'email') {
        Username = attr.Value;
      }
      UserAttributes.push(attr);
    });

    console.log('[restoreUserpoolData] UserAttributes:', UserAttributes);

    const params: AdminCreateUserRequest = {
      UserPoolId,
      Username,
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes,
      MessageAction: 'SUPPRESS',
      TemporaryPassword: tempPassword,
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
        throw `Looks like user ${user.Username} already exists, ignoring.`;
      } else {
        throw e;
      }
    }
  } // end for
  return 'OK';
};

/*
[backup/restore]
backup Userpool -> target Userpool
*/
const backupAndRestore = async (
  backupUserPoolId: string,
  restoreUserPoolId: string,
) => {
  const userdata = await backupUserpoolData([] as UserType[], {
    UserPoolId: backupUserPoolId,
  });

  const result = await restoreUserpoolData(userdata, restoreUserPoolId).catch(
    (err) => {
      console.log(err);
      return;
    },
  );
  console.log('backupAndRestore completed', result);
};

console.log(process.argv);

let modeFlagIdx = 99;
for (let i = 0; i < process.argv.length; i++) {
  let option = process.argv[i];
  if (option === '--mode') {
    modeFlagIdx = i;
    continue;
  }
  if (i === modeFlagIdx + 1) {
    console.log('option:', option);
    if (option === 'backup') {
      backupUserpoolData([] as UserType[], {
        UserPoolId: backupUserpoolId,
      }).then((userdata) => {
        // file 저장
        const file = path.join('/', `${stageName}-${backupUserpoolId}.json`);
        fs.writeFileSync(
          `${backupFilePrefix}-${stageName}-${backupUserpoolId}.json`,
          JSON.stringify(userdata, null, 2),
        );
      });
    } else if (option === 'backupandrestore') {
      backupAndRestore(backupUserpoolId, restoreUserpoolId);
    } else if (option === 'restore') {
      const userdata = require(`./${backedUpDataFileName}.json`) as ListUsersResponseType;
      console.log('userdata.length', userdata.length);
      restoreUserpoolData(userdata, restoreUserpoolId)
        .then((result) => {
          console.log('restore completed', result);
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    } else {
      console.log(
        'Please type one of the "backup", "backupandrestore", "restore" flag.',
      );
    }
    break;
  }
}
