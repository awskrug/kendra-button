import { Authenticator, Content, Sidebar } from '../components';

import { AuthState } from '@aws-amplify/ui-components';
import { useState } from 'react';

const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const onStateChange = (
    nextAuthState: AuthState,
    user: object | undefined | null,
  ) => {
    setIsLoggedIn(nextAuthState === 'signedin');
    setUser(user);
  };

  return (
    <>
      <Authenticator onStateChange={onStateChange} isLoggedIn={isLoggedIn}>
        <>
          <Sidebar user={user} setIsLoggedIn={setIsLoggedIn} />
          <Content />
        </>
      </Authenticator>
    </>
  );
};

export default Page;
