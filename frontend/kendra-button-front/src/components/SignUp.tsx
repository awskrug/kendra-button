import { AmplifyButton, AmplifyFormField, AmplifyPasswordField } from '@aws-amplify/ui-react';
import { ReactElement, useRef, useState } from 'react'
import { Auth } from 'aws-amplify';

interface Props {

}

const SignUp = (props: Props): ReactElement => {

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


  const onSubmit = async (e): Promise<void> => {
    let errors = []
    if (email.current.length === 0) {
      errors.push('"Email" 필드를 입력 해 주세요.');
    }
    if (password.current.length === 0) {
      errors.push('"Password" 필드를 입력 해 주세요.');
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
        setSignupAccSuccess('회원 가입이 완료 되었습니다.')
      }

    } catch (e) {
      console.log('error e ', e);
      let errormsg;
      if (e.code === 'InvalidParameterException') {
        let errors = [];
        if (e.message.indexOf('previousPassword') > -1) {
          errors.push('"Your Current Password" 입력이 잘못 되었습니다.');
        }
        if (e.message.indexOf('proposedPassword') > -1) {
          errors.push(
            '"Your New Password" 입력이 잘못 되었습니다. (최소 6글자 이상)',
          );
        }
        errormsg = errors.join(' / ');
      } else if (e.code === 'NotAuthorizedException') {
        errormsg = '유효하지 않은 "Password" 입니다.';
      } else if (e.code === 'LimitExceededException') {
        errormsg =
          '단기간에 너무 많은 시도가 있었습니다. 잠시 후에 다시 시도 해 주세요.';
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
                  <p className="mb-0">{signupAccErr}</p>
                </div>
              )}
              {signupAccSuccess && (
                <div className="alert alert-dismissible alert-success">
                  <p className="mb-0">{signupAccSuccess}</p>
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
              <AmplifyButton handleButtonClick={onSubmit}>Create Account</AmplifyButton>
            </div>
          </div>
        </div>
      </div>
    </>
  )


}

export { SignUp };