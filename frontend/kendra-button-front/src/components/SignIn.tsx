import { AmplifyButton, AmplifyFormField, AmplifyPasswordField } from '@aws-amplify/ui-react';
import { useRef, useState, Dispatch, SetStateAction, ReactElement } from 'react'
import { Auth } from 'aws-amplify';
import { AuthState } from '@aws-amplify/ui-components';

interface Props {
  setScreen?: Dispatch<SetStateAction<string>>;
  setUsername?: Dispatch<SetStateAction<string>>;

}


const SignIn = (props: Props): ReactElement => {
  const { setScreen, setUsername } = props;
  const email = useRef('');
  const password = useRef('');
  const [confirmRequired, setconfirmRequired] = useState<boolean>(false);
  const [emailErr, setEmailErr] = useState<string>('');
  const [passwordErr, setPasswordErr] = useState<string>('');
  const [signinAccErr, setSigninAccErr] = useState<string>('');


  const onEmailChange = (e): void => {
    email.current = e.target.value;
  };

  const onPasswordChange = (e): void => {
    password.current = e.target.value;
  };

  const onSubmit = async (e): Promise<void> => {
    if (email.current.length === 0) {
      setEmailErr('Required')
      return;
    }
    if (password.current.length === 0) {
      setPasswordErr('No password provided')
      return;
    }

    try {
      const res = await Auth.signIn(
        email.current,
        password.current
      );

      if (res) {
        setEmailErr('');
        setPasswordErr('');
      }
    } catch (e) {
      console.log('error e', e);
      setEmailErr('');
      setPasswordErr('');

      if (e.code === 'UserNotConfirmedException') {
        setSigninAccErr('Please confirm your email before sign in.')
        setconfirmRequired(true)
      } else {
        setSigninAccErr(e.message)
      }
    }
    return;
  };

  const toSignUp = (): void => {
    setScreen(AuthState.SignUp);
  };

  const toConfirm = (): void => {
    setUsername(email.current)
    setScreen(AuthState.ConfirmSignUp);
  };


  const toSignInGoogle = async (): Promise<void> => {
    try {
      //@ts-ignore
      await Auth.federatedSignIn({ provider: 'Google' });
    } catch (e) {
      console.log('[error in google]', e);
    }
  };
  const toSignInFacebook = async (e): Promise<void> => {
    try {
      //@ts-ignore
      await Auth.federatedSignIn({ provider: 'Facebook' });
    } catch (e) {
      console.log('[error in facebook]', e);
    }

  };

  return (
    <>
      <div className={`card col-sm-6 h-75  overflow-auto p-3 justify-content-between`}>
        <div></div>
        <div className={`signUpTitle mb-3`}>Sign in to your account </div>
        {signinAccErr && (
          <div className="alert alert-dismissible alert-warning">
            <div className="mb-0">{signinAccErr}</div>
          </div>
        )}
        {confirmRequired && (
          <div className="toConfirm btn mb-2" onClick={toConfirm}>Click here to confirm</div>
        )}

        <AmplifyFormField
          fieldId={'email'}
          handleInputChange={onEmailChange}
          label={'Email'}
          inputProps={{
            placeholder: 'Enter your email',
          }}
          required={true}
          value={null}
        />
        {emailErr && (
          <div className="alert alert-dismissible alert-warning">
            <div className="mb-0">{emailErr}</div>
          </div>
        )}

        <AmplifyPasswordField
          fieldId={'password'}
          handleInputChange={onPasswordChange}
          label={'Password'}
          inputProps={{
            placeholder: 'Enter your password',
          }}
          required={true}
          value={null}
        />
        {passwordErr && (
          <div className="alert alert-dismissible alert-warning">
            <div className="mb-0">{passwordErr}</div>
          </div>
        )}
        <AmplifyButton
          handleButtonClick={onSubmit}
        >Sign In</AmplifyButton>
        <div className={`mt-3`}> Don't have an account?
          <span className={`toSignUp btn`} onClick={toSignUp}>
            Sign Up
            </span>
          <div>
            <p className={`my-3 text-center`}> or </p>
            <div className={`socialLoginBtns d-flex m-auto mt-1 col-sm-12 col-md-6`} onClick={toSignInGoogle}>
              <img src="/google.png" className="w-100" />
            </div>
            <div className={`socialLoginBtns facebookLogin m-auto mt-1 col-sm-12 col-md-6`} onClick={toSignInFacebook}>
              <img src="/facebook.png" className="w-100" />
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <style global jsx>{`
      .signUpTitle{
        font-size: 1.8rem;
      }
      .toSignUp, .toConfirm{
        color: #ff9900;
        font-size: 0.9rem;
      }
      .socialLoginBtns{
        cursor: pointer;
      }
      `}</style>
    </>
  )


}

export { SignIn }