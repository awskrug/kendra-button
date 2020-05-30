import {
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifySignOut,
  AmplifySignUp,
} from '@aws-amplify/ui-react';

const Authenticator = ({ children }) => {
  return (
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
      <AmplifySignOut />
      {children}
    </AmplifyAuthenticator>
  );
};

export { Authenticator };
