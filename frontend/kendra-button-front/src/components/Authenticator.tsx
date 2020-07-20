import { Auth, Hub } from 'aws-amplify';
import { Confirmation, SignIn, SignUp, Title } from '../components';
import {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { AuthState } from '@aws-amplify/ui-components';
import { useRouter } from 'next/router';

interface Props {
  setUser: Dispatch<SetStateAction<any>>;
  setIsLoggedIn: Dispatch<SetStateAction<any>>;
  children: ReactNode;
  isLoggedIn: boolean;
}
const Authenticator = (props: Props): ReactElement => {
  const { children, setUser, isLoggedIn, setIsLoggedIn } = props;
  const [screen, setScreen] = useState(AuthState.SignIn);
  const [username, setUsername] = useState<string>('');

  const checkUser = async (retry, tryCnt = 1): Promise<void> => {
    const tryLimit = 3;
    console.log('[checkUser retryflag]', retry);
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log('[user:Auth]', user);
      setScreen(AuthState.SignedIn);
      setUser(user);
    } catch (e) {
      console.log('[error in checkUser]', e);
      if (retry === true && tryLimit > tryCnt) {
        setTimeout(() => {
          checkUser(retry, tryCnt + 1);
        }, 1000);
      }
    }
  };

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      setScreen(AuthState.SignIn);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const query = router.asPath;
    const errorDescription = query || '';
    if (
      errorDescription.includes('attributes+required') &&
      errorDescription.includes('email')
    ) {
      alert('Please check the email address on your Facebook account.');
      setScreen(AuthState.SignUp);
    } else {
      checkUser(false);
    }

    // intermittently failure
    // issue that describes same symptoms: https://github.com/aws-amplify/amplify-js/issues/6155#issue-644662860
    // only error occurs in development
    Hub.listen('auth', (data) => {
      console.log('[Hub] data', data);
      switch (data.payload.event) {
        case 'signIn':
          setScreen(AuthState.SignedIn);
          setIsLoggedIn(true);
          checkUser(false);
          break;
        case 'signIn_failure':
          console.log('[Hub] signIn_failure');
          break;
        default:
          break;
      }
    });
  }, []);

  return (
    <div
      className={`fullscreen d-flex flex-column justify-content-center align-items-center`}
    >
      {screen === AuthState.SignedIn ? (
        children
      ) : screen === AuthState.SignUp ? (
        <div className={`overflow-auto w-100`}>
          <Title />
          <SignUp setScreen={setScreen} setUsername={setUsername} />
        </div>
      ) : screen === AuthState.ConfirmSignUp ? (
        <div className={`overflow-auto w-100`}>
          <Title />
          <Confirmation setScreen={setScreen} username={username} />
        </div>
      ) : (
        <div className={`overflow-auto w-100`}>
          <Title />
          <SignIn setScreen={setScreen} setUsername={setUsername} />
        </div>
      )}
      <style global jsx>{`
        .fullscreen {
          height: 100vh;
          width: 100vw;
        }

        .kendra-button {
          font-family: 'Orbitron', sans-serif;
          font-size: 3rem;
        }
      `}</style>
    </div>
  );
};

export { Authenticator };
