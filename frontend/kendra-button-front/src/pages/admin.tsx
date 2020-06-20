import { Authenticator, Content, Sidebar } from '../components';

import { AuthState } from '@aws-amplify/ui-components';
import { User } from '../types';
import { useState } from 'react';

const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const onStateChange = (nextAuthState: AuthState, user: User) => {
    console.log('onStateChange user', user);
    setIsLoggedIn(nextAuthState === 'signedin');
    setUser(user);
  };

  return (
    <>
      <Authenticator onStateChange={onStateChange} isLoggedIn={isLoggedIn}>
        <>
          <Sidebar user={user} setIsLoggedIn={setIsLoggedIn} />
          <Content user={user} />
        </>
      </Authenticator>
    </>
  );
};

export default Page;
