import { AmplifyButton, AmplifyFormField } from '@aws-amplify/ui-react';
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useRef,
  useState,
} from 'react';

import { Auth } from 'aws-amplify';
import { AuthState } from '@aws-amplify/ui-components';
import { CognitoException } from '../types';
import { Loader } from './Loader';

interface Props {
  setScreen?: Dispatch<SetStateAction<string>>;
  username?: string;
}
// https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ConfirmSignUp.html#API_ConfirmSignUp_Errors
enum CognitoSignUpErrorState {
  CodeMismatchException = 'CodeMismatchException',
  ExpiredCodeException = 'ExpiredCodeException',
  TooManyFailedAttemptsException = 'TooManyFailedAttemptsException',
  TooManyRequestsException = 'TooManyRequestsException',
  UserNotFoundException = 'UserNotFoundException',
}

const Confirmation = (props: Props): ReactElement => {
  const { setScreen, username } = props;
  const confirmCode = useRef('');
  const [confirmErr, setConfirmErr] = useState<string>('');
  const [signupAccSuccess, setSignupAccSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onConfirmCodeChange = (e): void => {
    confirmCode.current = e.target.value;
  };

  const toSignIn = () => {
    setScreen(AuthState.SignIn);
  };

  const onSubmit = async (e): Promise<void> => {
    if (isLoading) return;
    setIsLoading(true);

    if (confirmCode.current.length === 0) {
      setIsLoading(false);
      setConfirmErr('Verification code required. \nPlease check your email.');
      return;
    }

    try {
      const res = await Auth.confirmSignUp(username, confirmCode.current);

      if (res === 'SUCCESS') {
        setConfirmErr('');
        setSignupAccSuccess('Sign Up Completed!');
      } else {
        setConfirmErr('Confirmation failed \nPlease check your email');
        return;
      }
    } catch (e) {
      const err: CognitoException<CognitoSignUpErrorState> = e;
      setConfirmErr('');
      console.log('error e ', err);
      setConfirmErr(err.message);
    }
    setIsLoading(false);
    return;
  };
  return (
    <>
      <div className="shadow col-sm-6 h-75 overflow-auto p-3 justify-content-between">
        <div></div>
        <div className={`confirmTitle`}>Confirm Sign Up </div>
        <p className={`text-secondary small mt-4`}>
          We've sent you a confirmation code to your email.
        </p>
        <div>
          {signupAccSuccess && (
            <div
              className="alert alert-dismissible alert-success signUpSuccess text-center px-0"
              onClick={toSignIn}
            >
              <p className="mb-0">{signupAccSuccess}</p>
              <p className="mb-0 small">Click here to Sign In </p>
            </div>
          )}
          {confirmErr && (
            <div className="alert alert-warning alert-dismissible" role="alert">
              <div className="mb-0">{confirmErr}</div>
            </div>
          )}

          {!signupAccSuccess && (
            <>
              <AmplifyFormField
                fieldId={'code'}
                handleInputChange={onConfirmCodeChange}
                label={'Confirmation code'}
                inputProps={{
                  placeholder: 'Enter your confirmation code',
                }}
                required={true}
                value={null}
              />
              <AmplifyButton handleButtonClick={onSubmit}>
                {isLoading && <Loader className={'mr-2'} />}
                Complete Sign Up
              </AmplifyButton>
            </>
          )}
        </div>
        <div></div>
      </div>
      <style global jsx>{`
        .confirmTitle {
          font-size: 1.5rem;
          font-family: 'Pacifico', cursive;
        }
        .backToSignIn {
          color: #ff9900;
          font-size: 0.9rem;
        }
        .signUpSuccess:hover {
          cursor: pointer;
          background-color: #b9e082;
        }
      `}</style>
    </>
  );
};

export { Confirmation };
