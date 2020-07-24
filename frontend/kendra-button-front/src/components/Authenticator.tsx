import { Auth, Hub } from 'aws-amplify';
import { Confirmation, Loader, SignIn, SignUp, Title } from '../components';
import {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { AuthState } from '@aws-amplify/ui-components';
import { ViewSource } from './ViewSource';
import { useModalContextImpls } from '../contexts';
import { useRouter } from 'next/router';

const TitleWithIcon = (): ReactElement => (
  <div className={`d-flex justify-content-center`}>
    <div
      className={`col-md-6 d-flex justify-content-between align-items-center`}
    >
      <div>
        <img src="/kendolle.png" style={{ height: '4rem' }} />
      </div>
      <Title extraClass={`text-break`} />
      <ViewSource size="large" alt />
    </div>
  </div>
);
interface Props {
  setUser: Dispatch<SetStateAction<any>>;
  setIsLoggedIn: Dispatch<SetStateAction<any>>;
  children: ReactNode;
  isLoggedIn: boolean;
}
const Authenticator = (props: Props): ReactElement => {
  const { children, setUser, isLoggedIn, setIsLoggedIn } = props;
  const { setModalConfig } = useModalContextImpls();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [screen, setScreen] = useState<AuthState>(AuthState.SignIn);
  const [username, setUsername] = useState<string>('');

  const checkUser = async (retry, tryCnt = 1): Promise<void> => {
    const tryLimit = 3;
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log('[user:Auth]', user);
      // it is worth in only dev mode
      setModalConfig({
        type: 'plain',
        display: false,
      });
      // setScreen(AuthState.SignedIn);
      setUser(user);
    } catch (e) {
      console.log('[error in checkUser]', e);
      if (retry === true && tryLimit > tryCnt) {
        setTimeout(() => {
          checkUser(retry, tryCnt + 1);
        }, 1000);
      }
    }
    setIsLoading(false);
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
          // setScreen(AuthState.SignedIn);
          setIsLoggedIn(true);
          checkUser(false);
          break;
        case 'signIn_failure':
          console.log('[Hub] signIn_failure');
          setIsLoading(false);
          setScreen(AuthState.SignIn);
          setModalConfig({
            type: 'plain',
            display: true,
            contentDisplay: ['body', 'footer'],
            content: 'Sign in failure. please try again.',
          });
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
      {isLoading && screen === AuthState.SignIn ? (
        <div className={`w-100`}>
          <TitleWithIcon />
          <div className={`text-center`}>
            <Loader
              className={`fontsize-5x ${isLoading ? 'svg-initsize' : ''}`}
            />
          </div>
        </div>
      ) : screen === AuthState.SignedIn ? (
        children
      ) : screen === AuthState.SignUp ? (
        <div className={`overflow-auto w-100`}>
          <TitleWithIcon />
          <SignUp setScreen={setScreen} setUsername={setUsername} />
        </div>
      ) : screen === AuthState.ConfirmSignUp ? (
        <div className={`overflow-auto w-100`}>
          <TitleWithIcon />
          <Confirmation setScreen={setScreen} username={username} />
        </div>
      ) : (
        <div className={`overflow-auto w-100`}>
          <TitleWithIcon />
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
          word-break: break-word;
        }

        .fontsize-5x {
          font-size: 5rem;
        }
        .svg-initsize {
          width: 1rem;
          height: 1rem;
        }
      `}</style>
    </div>
  );
};

export { Authenticator };
