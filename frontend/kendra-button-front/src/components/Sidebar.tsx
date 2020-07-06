import { Dispatch, ReactElement, SetStateAction } from 'react';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { Auth } from 'aws-amplify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Projects } from './Projects';
import { User } from '../types';
import { useMainContextImpls } from '../contexts';

interface Props {
  user: User;
  setIsLoggedIn?: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = (props: Props): ReactElement => {
  const { user, setIsLoggedIn } = props;
  const { dispatch } = useMainContextImpls();

  const signOut = async (): Promise<void> => {
    const user = await Auth.signOut();
    console.log('Signed out user ~?', user)
    setIsLoggedIn(false);
  };

  const goToSettingsPage = (): void => {
    dispatch({
      type: 'change-content',
      payload: {
        content: 'settings',
      },
    });
  };

  return (
    <>
      <div
        className={`bg-primary d-flex flex-column justify-content-between align-items-stretch align-items-center p-3 sidebar overflow-auto col-3`}
      >
        <div className={`d-flex flex-column`}>
          <div className={`btn-group my-3`}>
            <button type="button" className={`btn btn-danger`}>
              {user?.attributes?.email}
            </button>
            <button
              type="button"
              className={`btn btn-outline-danger`}
              onClick={signOut}
            >
              <FontAwesomeIcon className={``} icon={faSignOutAlt} />
            </button>
          </div>
          {user && <Projects />}
        </div>
        <div className={`d-flex flex-column`} onClick={goToSettingsPage}>
          <div className={`text-white btn btn-secondary`}>
            <FontAwesomeIcon className={`mr-2`} icon={faCog} />
            SETTINGS
          </div>
        </div>
      </div>
      <style jsx>{`
      @media screen and (min-width: 768px){
        .sidebar {
          position: fixed;
          z-index: 1;
          top: 0;
          left: 0;
          width: 30%;
          height: 100vh;
          box-shadow: 2px 0px 5px 0px #848484;
        }
      }
      @media screen and (max-width: 768px){
        .sidebar {
          width: 100vw;
          height: 50vh;
          box-shadow: 2px 0px 5px 0px #848484;
        }
      }

      `}</style>
    </>
  );
};

export { Sidebar };
