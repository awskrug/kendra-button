import { AmplifyButton, AmplifyFormField, AmplifyPasswordField } from '@aws-amplify/ui-react';
import { ReactElement, useRef, useState, Dispatch, SetStateAction } from 'react'
import { Auth } from 'aws-amplify';
import { AuthState } from '@aws-amplify/ui-components';

interface Props {
  setScreen?: Dispatch<SetStateAction<string>>;
  setUsername?: Dispatch<SetStateAction<string>>;
}

const SignUp = (props: Props): ReactElement => {
  const { setScreen, setUsername } = props;
  const email = useRef('');
  const password = useRef('');
  const [signupAccErr, setSignupAccErr] = useState<string>('');

  const onEmailChange = (e): void => {
    email.current = e.target.value;
  };

  const onPasswordChange = (e): void => {
    password.current = e.target.value;
  };

  const toSignIn = () => {
    setScreen(AuthState.SignIn)
  }

  const onSubmit = async (e): Promise<void> => {
    let errors = []
    if (email.current.length === 0) {
      errors.push('Please enter your email');
    }
    if (password.current.length === 0) {
      errors.push('Please enter your password');
    }
    if (errors.length > 0) {
      setSignupAccErr(errors.join('\n'));
      return;
    }

    try {
      const res = await Auth.signUp(
        email.current,
        password.current
      );
      if (res) {
        setSignupAccErr('');
        setUsername(email.current)
        setScreen(AuthState.ConfirmSignUp)
      }
    } catch (e) {
      console.log('error e ', e);
      let errormsg;
      if (e.code === 'InvalidParameterException') {
        let errors = [];
        if (e.message.indexOf('password') > -1) {
          errors.push('Password must contain the following: \n\n - Minimum length, which must be at least 6 characters but fewer than 99 characters. \n - Require numbers. \n - Require uppercase letters. \n - Require lowercase letters.')
        }
        errormsg = errors.join('\n');
      }
      setSignupAccErr(errormsg);
    }
    return;
  };

  return (
    <>
      <div className="card col-sm-6 h-75  overflow-auto p-3 justify-content-between">
        <div></div>
        <div className={`signUpTitle`}>Create a new account </div>
        <div>
          {signupAccErr && (
            <div className="alert alert-dismissible alert-warning">
              <div className="mb-0">{signupAccErr.split('\n').map(line => {
                return (<span>{line}<br /></span>)
              })}</div>
            </div>
          )}
          <AmplifyFormField
            fieldId={'email'}
            handleInputChange={onEmailChange}
            label={'Email'}
            inputProps={{
              placeholder: 'Input email',
            }}
            required={true}
            value={null}
          />
          <AmplifyPasswordField
            fieldId={'password'}
            handleInputChange={onPasswordChange}
            label={'Password'}
            inputProps={{
              placeholder: 'Input password',
            }}
            required={true}
            value={null}
          />
          <AmplifyButton
            handleButtonClick={onSubmit}
          >Create Account</AmplifyButton>
          <div className={`mt-3`}>Have an account?
                <span
              className={`backToSignIn btn`}
              onClick={toSignIn}
            > Sign In</span>
          </div>
        </div>
        <div></div>
      </div>
      <style global jsx>{`
      .signUpTitle{
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

export { SignUp };