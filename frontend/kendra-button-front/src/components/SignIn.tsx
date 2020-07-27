import * as Yup from "yup";

import { Dispatch, ReactElement, SetStateAction, useState } from "react";

import { AmplifyButton } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import { AuthState } from "@aws-amplify/ui-components";
import { useFormik } from "formik";

interface Props {
  setScreen?: Dispatch<SetStateAction<string>>;
  setUsername?: Dispatch<SetStateAction<string>>;
}

const SignIn = (props: Props): ReactElement => {
  const { setScreen, setUsername } = props;
  const [confirmRequired, setconfirmRequired] = useState<boolean>(false);
  const [signinAccErr, setSigninAccErr] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Please enter your email.")
        .email("Invalid email address."),
      password: Yup.string()
        .required("Please enter your password")
        .min(8)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
    }),
    onSubmit: () => {},
  });

  const onSubmit = async (e): Promise<void> => {
    formik.submitForm();
    if (!formik.isValid || !formik.values.email || !formik.values.password) {
      return;
    }

    try {
      const res = await Auth.signIn(
        formik.values.email,
        formik.values.password
      );
      if (res) {
        setSigninAccErr("");
      }
    } catch (e) {
      console.log("error e", e);
      if (e.code === "UserNotConfirmedException") {
        setSigninAccErr("Please confirm your email before sign in.");
        setconfirmRequired(true);
      } else {
        setSigninAccErr(e.message);
      }
    }
    return;
  };

  const toSignUp = (): void => {
    setScreen(AuthState.SignUp);
    // setScreen(AuthState.ConfirmSignUp);
  };

  const toConfirm = (): void => {
    setUsername(formik.values.email);
    setScreen(AuthState.ConfirmSignUp);
  };

  const toSignInGoogle = async (): Promise<void> => {
    try {
      //@ts-ignore
      await Auth.federatedSignIn({ provider: "Google" });
    } catch (e) {
      console.log("[error in google]", e);
    }
  };
  const toSignInFacebook = async (e): Promise<void> => {
    try {
      //@ts-ignore
      await Auth.federatedSignIn({ provider: "Facebook" });
    } catch (e) {
      console.log("[error in facebook]", e);
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
              formik.touched.email && formik.errors.email ? "is-invalid" : ""
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
            onBlur={formik.handleBlur}
            value={formik.values.password}
            onChange={formik.handleChange}
            className={`form-control ${
              formik.touched.password && formik.errors.password
                ? "is-invalid"
                : ""
            }`}
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
      </div>
      <style global jsx>{`
        .signUpTitle {
          font-size: 1.5rem;
          font-family: "Pacifico", cursive;
        }
        .toSignUp,
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
