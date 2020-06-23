import { Authenticator, Content, Sidebar } from '../components';

import { AuthState } from '@aws-amplify/ui-components';
import { User } from '../types';
import { useState } from 'react';

const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSignInScreen, setIsSignInScreen] = useState(false);

  const onStateChange = (nextAuthState: AuthState, user: User) => {
    setIsLoggedIn(nextAuthState === 'signedin');
    setUser(user);
    if (nextAuthState === 'signin') {
      setIsSignInScreen(true);
    } else {
      setIsSignInScreen(false);
    }
  };

  return (
    <>
      <Authenticator
        onStateChange={onStateChange}
        isLoggedIn={isLoggedIn}
        isSignInScreen={isSignInScreen}
      >
        <>
          <Sidebar user={user} setIsLoggedIn={setIsLoggedIn} />
          <Content user={user} setIsLoggedIn={setIsLoggedIn} />
        </>
      </Authenticator>
    </>
  );
};

export default Page;
