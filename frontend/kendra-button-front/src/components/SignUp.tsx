import { ReactElement, Dispatch, SetStateAction, useState } from 'react'
import { AuthState } from '@aws-amplify/ui-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Auth } from 'aws-amplify';

interface Props {
  setScreen?: Dispatch<SetStateAction<string>>;
  setUsername?: Dispatch<SetStateAction<string>>;
}

const SignUp = (props: Props): ReactElement => {
  const { setScreen, setUsername } = props;
  const [signupAccErr, setSignupAccErr] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Please enter your email.")
        .email("Invalid email address."),
      password: Yup.string()
        .required("Please enter your password")
        .min(8, 'Password is too short - should be 8 characters minimum.')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
    }),
    onSubmit: () => { },
  });


  const toSignIn = () => {
    setScreen(AuthState.SignIn)
  }

  const onSubmit = async (e): Promise<void> => {
    formik.submitForm();
    if (!formik.isValid || !formik.values.email || !formik.values.password) {
      return;
    }

    try {
      const res = await Auth.signUp(
        formik.values.email,
        formik.values.password
      );

      if (res) {
        setUsername(formik.values.email)
        setScreen(AuthState.ConfirmSignUp)
      }

    } catch (e) {
      console.log('error e ', e);
      setSignupAccErr(e.message)
    }
    formik.resetForm();
  }

  return (
    <>
      <div className="card col-sm-6 h-75  overflow-auto p-3 justify-content-between">
        <div></div>
        <div className={`signUpTitle mb-2`}>Create a new account </div>
        {signupAccErr && (
          <div className="alert alert-dismissible alert-warning">
            <div className="mb-0">{signupAccErr.split('\n').map(line => {
              return (<span>{line}<br /></span>)
            })}</div>
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={`form-control ${
              formik.touched.password && formik.errors.password ? 'is-invalid' : ''
              }`}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="invalid-feedback">{formik.errors.password}</div>
          )}
        </div>
        <button
          className={`btn btn-success shadow-sm`}
          onClick={onSubmit}
        >Create Account</button>
        <div className={`mt-3`}>Have an account?
                <span
            className={`backToSignIn btn`}
            onClick={toSignIn}
          > Sign In</span>
        </div>
        <div></div>
      </div>
      <style global jsx>{`
      .signUpTitle{
        font-size: 1.8rem;
      }
      .backToSignIn{
        color: #93c54c;
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