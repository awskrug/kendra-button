import { Auth, Hub, Logger } from 'aws-amplify';
import {
  CompletePW,
  Confirmation,
  ForgotPassword,
  Loader,
  SignIn,
  SignUp,
  Title,
} from '../components';
import {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import { AuthPage } from '../types';
import { CognitoUser } from '@aws-amplify/auth';
import { ViewSource } from './ViewSource';
import { useModalContextImpls } from '../contexts';
import { useRouter } from 'next/router';

const logger = new Logger('Authenticator');

const TitleWithIcon = (): ReactElement => (
  <div className={`d-flex justify-content-center`}>
    <div
      className={`col-md-6 d-flex justify-content-between align-items-center`}
    >
      <div>
        <img src="/kendoll-E.png" style={{ height: '4rem' }} />
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
  screen: AuthPage;
  setScreen: Dispatch<SetStateAction<any>>;
}
const Authenticator = (props: Props): ReactElement => {
  const {
    children,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    screen,
    setScreen,
  } = props;
  const { setModalConfig } = useModalContextImpls();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');

  const user = useRef<CognitoUser | any>(null);

  const checkUser = async (retry, tryCnt = 1): Promise<void> => {
    const tryLimit = 3;
    try {
      const user = await Auth.currentAuthenticatedUser();
      logger.log('[user:Auth]', user);
      // it is worth in only dev mode
      setModalConfig({
        type: 'plain',
        display: false,
      });
      setScreen(AuthPage.SignedIn);
      setUser(user);
    } catch (e) {
      logger.log('[error in checkUser]', e);
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
      setScreen(AuthPage.SignIn);
      checkUser(false);
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
      setScreen(AuthPage.SignUp);
    }

    // intermittently failure
    // issue that describes same symptoms: https://github.com/aws-amplify/amplify-js/issues/6155#issue-644662860
    // only error occurs in development
    Hub.listen('auth', (data) => {
      logger.log('[Hub] data', data);
      switch (data.payload.event) {
        case 'forgotPasswordSubmit':
        case 'signIn':
          setIsLoggedIn(true);
          checkUser(false);
          break;
        case 'signIn_failure':
          logger.log('[Hub] signIn_failure');

          setIsLoading(false);
          setScreen(AuthPage.SignIn);
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
      {isLoading && screen === AuthPage.SignIn ? (
        <div className={`w-100`}>
          <TitleWithIcon />
          <div className={`text-center`}>
            <Loader
              className={`fontsize-5x ${isLoading ? 'svg-initsize' : ''}`}
            />
          </div>
        </div>
      ) : screen === AuthPage.SignedIn ? (
        children
      ) : screen === AuthPage.SignUp ? (
        <div className={`overflow-auto w-100`}>
          <TitleWithIcon />
          <SignUp setScreen={setScreen} setUsername={setUsername} />
        </div>
      ) : screen === AuthPage.ConfirmSignUp ? (
        <div className={`overflow-auto w-100`}>
          <TitleWithIcon />
          <Confirmation setScreen={setScreen} username={username} />
        </div>
      ) : screen === AuthPage.ForgotPassword ? (
        <div className={`overflow-auto w-100`}>
          <TitleWithIcon />
          <ForgotPassword setScreen={setScreen} username={username} />
        </div>
      ) : screen === AuthPage.CompletePW ? (
        <div className={`overflow-auto w-100`}>
          <TitleWithIcon />
          <CompletePW setScreen={setScreen} username={username} user={user} />
        </div>
      ) : (
        <div className={`overflow-auto w-100`}>
          <TitleWithIcon />
          <SignIn setScreen={setScreen} setUsername={setUsername} user={user} />
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
          width: 2rem;
          height: 2rem;
        }
      `}</style>
    </div>
  );
};

export { Authenticator };
