import {
  AmplifyButton,
  AmplifyFormField,
  AmplifyPasswordField,
} from '@aws-amplify/ui-react';
import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

import { Auth } from 'aws-amplify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from '../types';
import { useModalContextImpls } from '../contexts';

interface Props {
  user: User;
  setIsLoggedIn?: Dispatch<SetStateAction<boolean>>;
}
const Settings = (props: Props): ReactElement => {
  const { user, setIsLoggedIn } = props;
  const passwordCurr = useRef('');
  const passwordNew = useRef('');
  const [displayAcc, setDisplayAcc] = useState<boolean>(false);
  const [updateAccErr, setUpdateAccErr] = useState<string>('');
  const [updateAccSuccess, setUpdateAccSuccess] = useState<string>('');
  const { setModalConfig } = useModalContextImpls();

  const toggleDisplay = (): void => {
    setDisplayAcc(!displayAcc);
    setUpdateAccErr('');
    setUpdateAccSuccess('');
  };

  const onChangeCurrPw = (e): void => {
    passwordCurr.current = e.target.value;
  };
  const onChangeNewPw = (e): void => {
    passwordNew.current = e.target.value;
  };

  const onSubmit = async (e): Promise<void> => {
    let errors = [];
    if (passwordCurr.current.length === 0) {
      errors.push('"Your Current Password" 필드를 입력 해 주세요.');
    }
    if (passwordNew.current.length === 0) {
      errors.push('"Your New Password" 필드를 입력 해 주세요.');
    }
    if (errors.length > 0) {
      setUpdateAccErr(errors.join(' / '));
      return;
    }

    try {
      const res = await Auth.changePassword(
        user,
        passwordCurr.current,
        passwordNew.current,
      );
      if (res === 'SUCCESS') {
        setUpdateAccErr('');
        setUpdateAccSuccess('비밀번호가 정상적으로 수정되었습니다.');
      }
    } catch (e) {
      console.log('error e', e);
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
        errormsg = '유효하지 않은 "Current Password" 입니다.';
      } else if (e.code === 'LimitExceededException') {
        errormsg =
          '단기간에 너무 많은 시도가 있었습니다. 잠시 후에 다시 시도 해 주세요.';
      }
      setUpdateAccErr(errormsg);
    }
    return;
  };

  const okaction = async ({ hideModal }): Promise<void> => {
    console.log('okaction');
    // TODO: delete from cognito and extra
    const user = await Auth.currentAuthenticatedUser();
    user.deleteUser((cb) => {
      console.log('cb', cb);
      hideModal();
      Auth.signOut();
      setIsLoggedIn(false);
    });
  };
  const deleteAccount = (): void => {
    setModalConfig({
      type: 'plain',
      display: true,
      title: '계정 탈퇴(work in process)',
      content:
        '정말 탈퇴하시겠습니까? 현재 계정 정보와 관련한 사이트 정보가 모두 삭제됩니다.',
      okaction,
    });
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
              {}
              <div className="fa-lg">계정 정보 수정</div>
              <FontAwesomeIcon
                className={`fa-lg`}
                icon={displayAcc ? faCaretUp : faCaretDown}
                role="button"
              />
            </div>
            <div className={displayAcc ? 'p-4' : 'd-none'}>
              {user.getUsername().includes('Google') ? (
                <div>
                  <p className={`socialLoginUpdate`}>We are sorry!</p>
                  <p className={`mb-0`}>You are not allowed to update your password if you logged in with Google.</p>
                </div>
              ) : user.getUsername().includes('Facebook') ? (
                <div>
                  <p className={`socialLoginUpdate`}>We are sorry!</p>
                  <p className={`mb-0`}>You are not allowed to update your password if you logged in with Facebook.</p>
                </div>
              ) :
                  (
                    <>
                      {updateAccErr && (
                        <div className="alert alert-dismissible alert-warning">
                          <p className="mb-0">{updateAccErr}</p>
                        </div>
                      )}
                      {updateAccSuccess && (
                        <div className="alert alert-dismissible alert-success">
                          <p className="mb-0">{updateAccSuccess}</p>
                        </div>
                      )}
                      <AmplifyFormField
                        fieldId={'email'}
                        label={'Your Email'}
                        inputProps={{
                          placeholder: 'placeholder',
                        }}
                        required={true}
                        value={user?.attributes?.email}
                        disabled={true}
                      />
                      <AmplifyPasswordField
                        fieldId={'curr-password'}
                        handleInputChange={onChangeCurrPw}
                        label={'Your Current Password'}
                        inputProps={{
                          placeholder: 'input current password',
                        }}
                        required={true}
                        value={null}
                      />
                      <AmplifyPasswordField
                        fieldId={'new-password'}
                        handleInputChange={onChangeNewPw}
                        label={'Your New Password'}
                        inputProps={{
                          placeholder: 'input new password',
                        }}
                        required={true}
                        value={null}
                      />
                      <AmplifyButton handleButtonClick={onSubmit}>Submit</AmplifyButton>
                    </>
                  )}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`align-items-center d-flex justify-content-between pb-1 p-3`}
      >
        <div className="card text-danger border-danger">
          <div className="card-header">계정 탈퇴</div>
          <div className="card-body">
            <div className={'btn btn-danger mb-2'} onClick={deleteAccount}>
              계정 탈퇴
            </div>
            <p className="card-text">
              계정 정보와 관련한 사이트 정보가 모두 삭제됩니다.
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
      .socialLoginUpdate {
        font-size: 1.1rem;
      }
      `}</style>
    </>
  );
};

export { Settings };
