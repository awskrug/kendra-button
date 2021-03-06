import Amplify, { Auth, Logger } from 'aws-amplify';
import { Authenticator, Content, Sidebar } from '../components';

import { AuthPage } from '../types';
import awsconfig from '../aws-exports';
import { useState } from 'react';

const logger = new Logger('Index');
const oauthConfig = awsconfig.oauth
  ? {
      ...awsconfig.oauth,
      redirectSignIn:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/'
          : awsconfig.oauth.redirectSignIn
              .split(',')
              .filter((url) => !url.includes('localhost'))[0],
      redirectSignOut:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/'
          : awsconfig.oauth.redirectSignOut
              .split(',')
              .filter((url) => !url.includes('localhost'))[0],
    }
  : {};
const url = 'https://prod.kendra-btns.whatilearened.today/graphql';

Amplify.configure({
  ...awsconfig,
  oauth: oauthConfig,
  API: {
    graphql_endpoint: url,
    graphql_headers: async () => ({
      Authorization: (await Auth.currentSession()).getIdToken().getJwtToken(),
    }),
  },
});
Amplify.Logger.LOG_LEVEL = process.env.NODE_ENV === 'development' && 'INFO';

interface Props {
  code?: string;
  state?: string;
}
const Page = (props: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState<AuthPage>(AuthPage.SignIn);

  logger.log(oauthConfig);

  return (
    <>
      <Authenticator
        setUser={setUser}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        screen={screen}
        setScreen={setScreen}
      >
        <>
          <Sidebar user={user} setScreen={setScreen} />
          <Content user={user} setIsLoggedIn={setIsLoggedIn} />
        </>
      </Authenticator>
    </>
  );
};

export default Page;
