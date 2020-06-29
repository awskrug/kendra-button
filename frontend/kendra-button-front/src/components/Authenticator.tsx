import {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { Auth, Hub, Logger } from 'aws-amplify';
import { AuthState } from '@aws-amplify/ui-components';

import { SignUp } from '../components';

interface Props {
  setUser: Dispatch<SetStateAction<any>>;
  children: ReactNode;
  isLoggedIn: boolean;
  error?: string;
}
const Authenticator = (props: Props): ReactElement => {
  const { children, setUser, error } = props;
  const [screen, setScreen] = useState(AuthState.SignIn);

  const logger = new Logger('foo')

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

  useEffect(() => {
    //@ts-ignore
    Logger.LOG_LEVEL = 'DEBUG';
    if (error) {
      alert(error)
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


  const toSignUp = (): void => {
    setScreen(AuthState.SignUp);
  };
  const toSignInGoogle = async (): Promise<void> => {
    try {
      //@ts-ignore
      const res = await Auth.federatedSignIn({ provider: 'Google' });
      console.log('res', res);
      if (logger.error) {
      }
    } catch (e) {
      console.log('[error in google]', e);
    }
  };
  const toSignInFacebook = async (e): Promise<void> => {
    try {
      //@ts-ignore
      const res = await Auth.federatedSignIn({ provider: 'Facebook' });
      console.log('res', res);

      // if (typeof res === "undefined") {
      //   alert('Invalid Facebook account. \nPlease check the email address on your Facebook account.')
      // }
    } catch (e) {
      console.log('[error in facebook]', e);
    }

  };


  const bgClass = screen === AuthState.SignIn || screen === AuthState.SignUp ? `bg-dark` : ``;
  return (
    <div
      className={`fullscreen ${bgClass} d-flex justify-content-center align-items-center`}
    >
      {screen === AuthState.SignedIn ? (
        children
      ) : screen === AuthState.SignUp ? (
        <> <SignUp setScreen={setScreen} /> </>
      ) : (
            <>
              <div className={`btn btn-info`} onClick={toSignUp}>
                signup
            </div>
              <div className={`btn btn-danger`} onClick={toSignInGoogle}>
                Sign in with Google
            </div>
              <div className={`btn btn-primary`} onClick={toSignInFacebook}>
                Sign in with Facebook
            </div>
            </>
          )}
      <style global jsx>{`
          .fullscreen {
            height: 100vh;
            width: 100vw;
          }
        `}</style>
    </div>
  );
};

export { Authenticator };