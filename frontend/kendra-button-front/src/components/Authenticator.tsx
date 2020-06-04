import {
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifySignUp,
} from '@aws-amplify/ui-react';
import { ReactElement, ReactNode, useEffect } from 'react';

// https://github.com/aws-amplify/amplify-js/issues/5825#issuecomment-631759616
import { onAuthUIStateChange } from '@aws-amplify/ui-components';

interface Props {
  children: ReactNode;
  onStateChange?: any;
  isLoggedIn: boolean;
}
const Authenticator = (props: Props): ReactElement => {
  const { children, onStateChange, isLoggedIn } = props;

  useEffect(() => {
    return onAuthUIStateChange((newAuthState, user) => {
      onStateChange(newAuthState, user)
    });
  }, []);

  const bgClass = isLoggedIn ? `` : `bg-dark`
  return (
    <div
      className={`fullscreen ${bgClass} d-flex justify-content-center align-items-center`}
    >
      <AmplifyAuthenticator usernameAlias='email'>
        <AmplifySignUp
          slot='sign-up'
          usernameAlias='email'
          formFields={[
            {
              type: 'email',
              label: 'Custom email Label',
              placeholder: 'custom email placeholder',
              required: true,
            },
            {
              type: 'password',
              label: 'Custom Password Label',
              placeholder: 'custom password placeholder',
              required: true,
            },
            {
              type: 'phone_number',
              label: 'Custom Phone Label',
              placeholder: 'custom Phone placeholder',
              required: false,
            },
          ]}
        />
        {children}
      </AmplifyAuthenticator>
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
