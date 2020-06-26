import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import { ReactElement, ReactNode, useEffect } from 'react';

import { Auth } from 'aws-amplify';
// https://github.com/aws-amplify/amplify-js/issues/5825#issuecomment-631759616
import { onAuthUIStateChange } from '@aws-amplify/ui-components';

interface Props {
  children: ReactNode;
  onStateChange?: any;
  isLoggedIn: boolean;
  isSignInScreen: boolean;
}
const Authenticator = (props: Props): ReactElement => {
  const { children, onStateChange, isLoggedIn, isSignInScreen } = props;

  useEffect(() => {
    return onAuthUIStateChange((newAuthState, user) => {
      onStateChange(newAuthState, user);
    });

  }, []);

  const googleSocialClick = () => {
    // https://www.youtube.com/watch?v=eqDUSY9KHYE&t=319s
    // @ts-ignore
    Auth.federatedSignIn({ provider: 'Google' });
  }
  const facebookSocialClick = () => {
    // https://www.youtube.com/watch?v=F6ZPTKiEJx4
    // @ts-ignore
    Auth.federatedSignIn({ provider: 'Facebook' });
  }

  // const socialClick = () => {
  //   Auth.federatedSignIn();
  // }


  const bgClass = isLoggedIn ? `` : `bg-dark`;
  return (
    <div
      className={`fullscreen ${bgClass} d-flex flex-column justify-content-center align-items-center`}
    >
      <div className={`auth-wrapper bg-white rounded position-relative`}>
        <div className={`auth-system`}>
          <AmplifyAuthenticator usernameAlias="email">
            <AmplifySignUp
              slot="sign-up"
              usernameAlias="email"
              formFields={[
                {
                  type: 'email',
                  label: 'Email',
                  placeholder: 'input email',
                  required: true,
                },
                {
                  type: 'password',
                  label: 'Password',
                  placeholder: 'input password',
                  required: true,
                },
              ]}
            />
            {children}
          </AmplifyAuthenticator>
        </div>
        {isSignInScreen && (
          <div
            className={`auth-custom bg-white p-3 w-100 position-absolute rounded-bottom`}
          >
            <div className={`btn btn-warning d-block mb-1`} onClick={googleSocialClick}>Sign in with Google</div>
            <div className={`btn btn-primary d-block mb-1`} onClick={facebookSocialClick}>Sign in with Facebook</div>
            {/* <div className={`btn d-block`} onClick={socialClick}>Go to Hosted UI Login Page</div> */}
          </div>
        )}
      </div>
      <style global jsx>{`
        .fullscreen {
          height: 100vh;
          width: 100vw;
        }
        .auth-wrapper .auth-system {
          z-index: 1;
        }
        .auth-wrapper .auth-custom {
          bottom: -4rem;
          left: 0;
          z-index: 999;
        }

      `}</style>
    </div>
  );
};

export { Authenticator };
