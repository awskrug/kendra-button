import { Authenticator, Content, Sidebar } from '../components';

import { AuthState } from '@aws-amplify/ui-components';
import { Logger } from 'aws-amplify';
import { User } from '../types';
import { useState } from 'react';

const logger = new Logger('admin');

const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const onStateChange = (nextAuthState: AuthState, user: User) => {
    logger.log('onStateChange user', user);
    setIsLoggedIn(nextAuthState === 'signedin');
    setUser(user);
  };

  return (
    <>
      <Authenticator onStateChange={onStateChange} isLoggedIn={isLoggedIn}>
        <>
          <Sidebar user={user} setIsLoggedIn={setIsLoggedIn} />
          <Content user={user} setIsLoggedIn={setIsLoggedIn} />
        </>
      </Authenticator>
    </>
  );
};

export default Page;
