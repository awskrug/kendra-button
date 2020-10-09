import * as Yup from 'yup';

import { Auth, Logger } from 'aws-amplify';
import {
  Dispatch,
  KeyboardEvent,
  MutableRefObject,
  ReactElement,
  SetStateAction,
  useRef,
  useState,
} from 'react';

import { AmplifyButton } from '@aws-amplify/ui-react';
import { AuthPage } from '../types';
import { useFormik } from 'formik';

const logger = new Logger('SignIn');

interface Props {
  setScreen?: Dispatch<SetStateAction<string>>;
  setUsername?: Dispatch<SetStateAction<string>>;
  user?: MutableRefObject<any>;
}

const SignIn = (props: Props): ReactElement => {
  const { setScreen, setUsername, user } = props;
  const [confirmRequired, setconfirmRequired] = useState<boolean>(false);
  const [signinAccErr, setSigninAccErr] = useState<string>('');
  const formPw = useRef(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required('Please enter your email.')
        .email('Invalid email address.'),
      password: Yup.string().required('Please enter your password'),
    }),
    onSubmit: () => {},
  });

  const onKeyDownOnEmail = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.keyCode === 13 && formPw.current) {
      formPw.current.focus();
    }
  };
  const onKeyDownOnPw = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.keyCode === 13) {
      setSigninAccErr(false);
      onSubmit();
    }
  };

  const onSubmit = async (): Promise<void> => {
    formik.submitForm();
    if (!formik.isValid || !formik.values.email || !formik.values.password) {
      return;
    }

    try {
      const res = await Auth.signIn(
        formik.values.email,
        formik.values.password,
      );
      logger.log('signin res', res);

      if (res.challengeName === 'NEW_PASSWORD_REQUIRED') {
        setScreen(AuthPage.CompletePW);
        setUsername(formik.values.email);
        user.current = res;
      } else if (res) {
        setSigninAccErr('');
      }
    } catch (e) {
      logger.error('error e', e);
      if (e.code === 'UserNotConfirmedException') {
        setSigninAccErr('Please confirm your email before sign in.');
        setconfirmRequired(true);
      } else {
        setSigninAccErr(e.message);
      }
    }
    return;
  };

  const toSignUp = (): void => {
    setScreen(AuthPage.SignUp);
  };
  const toForgotPW = (): void => {
    setScreen(AuthPage.ForgotPassword);
  };

  const toConfirm = (): void => {
    setUsername(formik.values.email);
    setScreen(AuthPage.ConfirmSignUp);
  };

  const toSignInGoogle = async (): Promise<void> => {
    try {
      //@ts-ignore
      await Auth.federatedSignIn({ provider: 'Google' });
    } catch (e) {
      logger.error('[error in google]', e);
    }
  };
  const toSignInFacebook = async (e): Promise<void> => {
    try {
      //@ts-ignore
      await Auth.federatedSignIn({ provider: 'Facebook' });
    } catch (e) {
      logger.error('[error in facebook]', e);
    }
  };
  return (
    <div className={`row justify-content-center m-2 mb-4`}>
      <div className={`rounded shadow col-sm-6 overflow-auto p-3`}>
        <div className={`signUpTitle mb-3`}>Sign In </div>
        {signinAccErr && (
          <div className="alert alert-dismissible alert-danger">
            <div className="mb-0">{signinAccErr}</div>
          </div>
        )}
        {confirmRequired && (
          <div className="toConfirm btn mb-2" onClick={toConfirm}>
            Click here to confirm
          </div>
        )}

        <div className="form-group">
          <label
            className="form-control-label font-weight-bold"
            htmlFor="email"
          >{`Email`}</label>
          <input
            id="email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            className={`form-control ${
              formik.touched.email && formik.errors.email ? 'is-invalid' : ''
            }`}
            onKeyDown={onKeyDownOnEmail}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="invalid-feedback">{formik.errors.email}</div>
          )}
        </div>
        <div className="form-group">
          <label
            className="form-control-label font-weight-bold"
            htmlFor="password"
          >{`Password`}</label>
          <input
            type="password"
            id="password"
            name="password"
            onBlur={formik.handleBlur}
            value={formik.values.password}
            onChange={formik.handleChange}
            className={`form-control ${
              formik.touched.password && formik.errors.password
                ? 'is-invalid'
                : ''
            }`}
            onKeyDown={onKeyDownOnPw}
            ref={formPw}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="invalid-feedback">{formik.errors.password}</div>
          )}
        </div>
        <AmplifyButton handleButtonClick={onSubmit}>Sign In</AmplifyButton>
        <div className={`row justify-content-between`}>
          <div
            className={`socialLoginBtns mt-1 col-sm-12 col-md-6 col-xl-4`}
            onClick={toSignInGoogle}
          >
            <img src="/google.png" className="w-100" role="button" />
          </div>
          <div
            className={`socialLoginBtns mt-1 col-sm-12 col-md-6 col-xl-4`}
            onClick={toSignInFacebook}
          >
            <img src="/facebook.png" className="w-100" role="button" />
          </div>
        </div>
        <div className={`mt-3`}>
          Don't have an account?
          <span className={`toSignUp btn`} onClick={toSignUp}>
            Sign Up
          </span>
        </div>
        <div className={`mt-3`}>
          You Forgot your password?
          <span className={`toForgotPW btn`} onClick={toForgotPW}>
            Reset Password
          </span>
        </div>
      </div>
      <style global jsx>{`
        .signUpTitle {
          font-size: 1.5rem;
          font-family: 'Pacifico', cursive;
        }
        .toSignUp,
        .toForgotPW,
        .toConfirm {
          color: #ff9900;
          font-size: 1rem;
        }
        .socialLoginBtns {
        }
      `}</style>
    </div>
  );
};

export { SignIn };
