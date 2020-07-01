import { AmplifyButton, AmplifyFormField } from '@aws-amplify/ui-react';
import { ReactElement, useRef, useState, Dispatch, SetStateAction } from 'react'
import { Auth } from 'aws-amplify';
import { AuthState } from '@aws-amplify/ui-components';


interface Props {
  setScreen?: Dispatch<SetStateAction<string>>;
  username?: string;
}


const Confirmation = (props: Props): ReactElement => {
  const { setScreen, username } = props;
  const confirmCode = useRef('');
  const [confirmErr, setConfirmErr] = useState<string>('');
  const [signupAccSuccess, setSignupAccSuccess] = useState<string>('');


  const onConfirmCodeChange = (e): void => {
    confirmCode.current = e.target.value;
  }

  const toSignIn = () => {
    setScreen(AuthState.SignIn)
  }

  const onSubmit = async (e): Promise<void> => {

    if (confirmCode.current.length === 0) {
      setConfirmErr('Verification code required \nPlease check your email')
      return;
    }

    try {
      const res = await Auth.confirmSignUp(
        username,
        confirmCode.current
      );

      if (res === "SUCCESS") {
        setConfirmErr('')
        setSignupAccSuccess('Sign Up Completed!')
      } else {
        setConfirmErr('Confirmation failed \nPlease check your email')
        return;
      }

    } catch (e) {
      console.log('error e ', e);
    }
    return;
  };
  return (
    <>
      <div className="card col-sm-6 h-75  overflow-auto p-3 justify-content-between">
        <div></div>
        <div className={`confirmTitle`}>Confirm Sign Up </div>
        <p className={`text-secondary small`}>We've sent you a confirmation code to your email.</p>
        <div>
          {signupAccSuccess && (
            <div className="alert alert-dismissible alert-success signUpSuccess" onClick={toSignIn}>
              <p className="mb-0">{signupAccSuccess}</p>
              <p className="mb-0 small">Click here to Sign In </p>
            </div>
          )}
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
          {confirmErr && (
            <div className="alert alert-dismissible alert-warning">
              <div className="mb-0">{confirmErr}</div>
            </div>
          )}

          <AmplifyButton
            handleButtonClick={onSubmit}
          >Complete Sign Up</AmplifyButton>
        </div>
        <div></div>
      </div>
      <style global jsx>{`
  .confirmTitle{
    font-size: 1.8rem;
  }
  .backToSignIn{
    color: #ff9900;
    font-size: 0.9rem;
  }
  .signUpSuccess:hover{
    cursor: pointer;
    background-color: #b9e082;
  }
  `}</style>

    </>
  )

}

export { Confirmation }