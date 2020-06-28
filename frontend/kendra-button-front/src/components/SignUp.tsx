import { AmplifyButton, AmplifyFormField, AmplifyPasswordField } from '@aws-amplify/ui-react';
import { ReactElement, useRef, useState, Dispatch, SetStateAction } from 'react'
import { Auth } from 'aws-amplify';
import { AuthState } from '@aws-amplify/ui-components';

interface Props {
  setScreen?: Dispatch<SetStateAction<string>>;
}

const SignUp = (props: Props): ReactElement => {
  const { setScreen } = props;
  const email = useRef('');
  const password = useRef('');
  const [displayAcc, setDisplayAcc] = useState<boolean>(false);
  const [signupAccSuccess, setSignupAccSuccess] = useState<string>('');
  const [signupAccErr, setSignupAccErr] = useState<string>('');


  const toggleDisplay = (): void => {
    setDisplayAcc(!displayAcc);
    setSignupAccErr('');
    setSignupAccSuccess('');
  };


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
      setSignupAccErr(errors.join(' / '));
      return;
    }

    try {
      const res = await Auth.signUp(
        email.current,
        password.current
      );
      if (res) {
        setSignupAccErr('');
        setSignupAccSuccess('Sign Up Completed!')
      }

    } catch (e) {
      console.log('error e ', e);
      let errormsg;
      if (e.code === 'InvalidParameterException') {
        let errors = [];
        if (e.message.indexOf('password') > -1) {
          errors.push('Password must contain the following: \n - Minimum length, which must be at least 6 characters but fewer than 99 characters. \n - Require numbers. \n - Require uppercase letters. \n - Require lowercase letters.')
        }
        errormsg = errors.join('\n');
      }
      setSignupAccErr(errormsg);
    }
    return;
  };

  return (
    <>
      <div
        className={`align-items-center d-flex justify-content-between pb-1 p-3`}
      >
        <div className="card w-100">
          <div className="">
            <div
              className={
                'd-flex justify-content-between align-items-center btn btn-light p-3'
              }
              onClick={toggleDisplay}
            >
              <div className={`fa-lg`}>Create a new account </div>
            </div>
            <div className={displayAcc ? 'p-4' : 'd-none'}>
              {signupAccErr && (
                <div className="alert alert-dismissible alert-warning">
                  <div className="mb-0">{signupAccErr.split('\n').map(line => {
                    return (<span>{line}<br /></span>)
                  })}</div>
                </div>
              )}
              {signupAccSuccess && (
                <div className="alert alert-dismissible alert-success signUpSuccess" onClick={toSignIn}>
                  <p className="mb-0">{signupAccSuccess}</p>
                  <p className="mb-0 small">Click here to Sign In </p>
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
          </div>
        </div>
      </div>
      <style global jsx>{`
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