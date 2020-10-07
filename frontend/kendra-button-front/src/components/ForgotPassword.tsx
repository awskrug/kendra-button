import * as Yup from 'yup';

import { Auth, Logger } from 'aws-amplify';
import { AuthPage, CognitoException } from '../types';
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { Loader } from './Loader';
import { useFormik } from 'formik';

const logger = new Logger('SignUp');

interface Props {
  setScreen?: Dispatch<SetStateAction<string>>;
  username?: string;
}

// https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SignUp.html#API_SignUp_Errors
enum CognitoResetPasswordErrorState {
  UsernameExistsException = 'UsernameExistsException',
  CodeMismatchException = 'CodeMismatchException',
}

const ForgotPassword = (props: Props): ReactElement => {
  const { setScreen } = props;
  const [signupAccErr, setSignupAccErr] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMailSent, setIsMailSent] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      code: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required('Please enter your email.')
        .email('Invalid email address.'),
      password: Yup.string()
        .required('Please enter your password')
        .min(8, 'Password is too short - should be 8 characters minimum.')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
        ),
      code: Yup.string(),
    }),
    onSubmit: () => {},
  });

  useEffect(() => {
    logger.log('Recoveraccount props', props);
    if (!props.username) return;
    formik.values.email = props.username;
  }, [props.username]);

  const toSignIn = () => {
    setScreen(AuthPage.SignIn);
  };

  const onReqForgotPW = async (e): Promise<void> => {
    if (isLoading) return;
    setIsLoading(true);
    formik.submitForm();
    // if (!formik.isValid || !formik.values.email || !formik.values.password) {
    if (!formik.values.email) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await Auth.forgotPassword(formik.values.email);

      if (res) {
        setIsMailSent(true);
      }
    } catch (e) {
      logger.error('error e ', e);
      const err: CognitoException<CognitoResetPasswordErrorState> = e;
      let errmsg = err.message;
      setSignupAccErr(errmsg);
    }
    // formik.resetForm();
    setIsLoading(false);
  };

  const onConfirmForgotPW = async (e): Promise<void> => {
    if (isLoading) return;
    setIsLoading(true);
    formik.submitForm();
    if (
      !formik.isValid ||
      !formik.values.email ||
      !formik.values.password ||
      !formik.values.code
    ) {
      setIsLoading(false);
      return;
    }

    try {
      await Auth.forgotPasswordSubmit(
        formik.values.email,
        formik.values.code,
        formik.values.password,
      );
      setScreen(AuthPage.SigningUp);
    } catch (e) {
      logger.error('error e ', e);
      const err: CognitoException<CognitoResetPasswordErrorState> = e;
      let errmsg = err.message;
      setSignupAccErr(errmsg);

      if (err.code === CognitoResetPasswordErrorState.CodeMismatchException) {
        formik.setErrors({ code: errmsg });
      }
    }
    // formik.resetForm();
    setIsLoading(false);
  };

  return (
    <div className={`row justify-content-center m-2 mb-4`}>
      <div className="rounded shadow col-sm-6 overflow-auto p-3 justify-content-between">
        <div className={`signUpTitle mb-2`}>
          Recover Account: Reset Password
        </div>
        {signupAccErr && (
          <div className="alert alert-dismissible alert-warning">
            <div className="mb-0">
              {signupAccErr.split('\n').map((line, lIdx) => {
                return (
                  <span key={'signup-err-' + lIdx}>
                    {line}
                    <br />
                  </span>
                );
              })}
            </div>
          </div>
        )}
        {isMailSent && (
          <div className="alert alert-dismissible alert-info">
            Your confirmation code has been sent to your email.
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
            disabled={isMailSent}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="invalid-feedback">{formik.errors.email}</div>
          )}
        </div>
        {isMailSent && (
          <>
            <div className="form-group">
              <label
                className="form-control-label font-weight-bold"
                htmlFor="reset-code"
              >{`Confirmation Code`}</label>
              <input
                type="text"
                id="reset-code"
                name="code"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.code}
                className={`form-control ${
                  formik.touched.code && formik.errors.code ? 'is-invalid' : ''
                }`}
              />
              {formik.touched.code && formik.errors.code && (
                <div className="invalid-feedback">{formik.errors.code}</div>
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`form-control ${
                  formik.touched.password && formik.errors.password
                    ? 'is-invalid'
                    : ''
                }`}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback">{formik.errors.password}</div>
              )}
            </div>
          </>
        )}
        <button
          className={`btn btn-success shadow-sm w-100`}
          onClick={!isMailSent ? onReqForgotPW : onConfirmForgotPW}
        >
          {isLoading && <Loader className={'mr-2'} />}
          {!isMailSent ? `Request to Reset Password` : `Confirm`}
        </button>
        <div className={`mt-3`}>
          Have an account?
          <span className={`backToSignIn btn`} onClick={toSignIn}>
            {' '}
            Sign In
          </span>
        </div>
      </div>
      <style global jsx>{`
        .signUpTitle {
          font-size: 1.5rem;
          font-family: 'Pacifico', cursive;
        }
        .backToSignIn {
          color: #93c54c;
          font-size: 0.9rem;
        }
        .signUpSuccess:hover {
          cursor: pointer;
          background-color: #b9e082;
        }
      `}</style>
    </div>
  );
};

export { ForgotPassword };
