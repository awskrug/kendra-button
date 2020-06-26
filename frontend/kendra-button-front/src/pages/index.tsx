import Amplify, { Auth } from 'aws-amplify';
import { Authenticator, Content, Sidebar } from '../components';

// import { User } from '../types';
import awsconfig from '../aws-exports';
import { useState } from 'react';

const manualConfig = {
  ...awsconfig,
  oauth: awsconfig.oauth
    ? {
      ...awsconfig.oauth,
      redirectSignIn:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/'
          : awsconfig.oauth.redirectSignIn,
      redirectSignOut:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/'
          : awsconfig.oauth.redirectSignIn,
    }
    : {},
};
// const manualConfig = {}
const url =
  'https://f9hg6qjmt8.execute-api.us-west-2.amazonaws.com/dev/graphql'; // dev
Amplify.configure({
  ...manualConfig,
  API: {
    graphql_endpoint: url,
    graphql_headers: async () => ({
      Authorization: (await Auth.currentSession()).getIdToken().getJwtToken(),
    }),
  },
});
const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  console.log({ isLoggedIn });

  return (
    <>
      <Authenticator setUser={setUser} isLoggedIn={isLoggedIn}>
        <>
          <Sidebar user={user} setIsLoggedIn={setIsLoggedIn} />
          <Content user={user} setIsLoggedIn={setIsLoggedIn} />
        </>
      </Authenticator>
    </>
  );
};

export default Page;