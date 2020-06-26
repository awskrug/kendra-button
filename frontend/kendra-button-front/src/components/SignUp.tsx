import { AmplifyButton, AmplifyFormField, AmplifyPasswordField } from '@aws-amplify/ui-react';
import { ReactElement, useRef, useState } from 'react'
import { Auth } from 'aws-amplify';

import { useModalContextImpls } from '../contexts';

interface Props {

}


const SignUp = (props: Props): ReactElement => {

  const email = useRef('');
  const password = useRef('');
  const passwordConfirm = useRef('');

  const [signupAccSuccess, setSignupAccSuccess] = useState<string>('');
  const [signupAccErr, setSignupAccErr] = useState<string>('');


  const onEmailChange = (e): void => {
    email.current = e.target.value;
  };

  const onPasswordChange = (e): void => {
    password.current = e.target.value;
  };

  const onPasswordConfirmChange = (e): void => {
    passwordConfirm.current = e.target.value;
  };

  const onSubmit = async (e): Promise<void> => {
    let errors = []
    if (email.current.length === 0) {
      errors.push('"Email" 필드를 입력 해 주세요.');
    }
    if (password.current.length === 0) {
      errors.push('"Password" 필드를 입력 해 주세요.');
    }
    if (passwordConfirm.current.length === 0) {
      errors.push('"Password confirmation" 필드를 입력 해 주세요.');
    }

    if (password.current !== passwordConfirm.current) {
      errors.push('비밀번호를 확인 해 주세요.')
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

    }
    return;
  }


}

export { SignUp };