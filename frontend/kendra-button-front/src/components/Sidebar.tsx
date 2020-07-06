import { Dispatch, ReactElement, SetStateAction, useState } from 'react';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { Auth } from 'aws-amplify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Projects } from './Projects';
import { User } from '../types';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useMainContextImpls } from '../contexts';

interface Props {
  user: User;
  setIsLoggedIn?: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = (props: Props): ReactElement => {
  const { user, setIsLoggedIn } = props;
  const { dispatch } = useMainContextImpls();
  const [displayAcc, setDisplayAcc] = useState<boolean>(false);


  const sideBarClasses = 'flex-column justify-content-between align-items-stretch align-items-center p-3 bg-primary sidebar'

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

  const toggleDisplay = (): void => {
    setDisplayAcc(!displayAcc)
  }

  return (
    <>
      <div className={`p-2 hamburger-btn ${displayAcc ? `text-white` : `text-dark`}`} onClick={toggleDisplay}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      <div className={`sidebar bg-primary overflow-auto ${sideBarClasses} ${displayAcc ? `d-flex fullWidthSidebar` : ``}`}>
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
        @media (min-width: 992px) {
          .sidebar {
            position: fixed;
            z-index: 1;
            top: 0;
            left: 0;
            width: 30%;
            height: 100vh;
            box-shadow: 2px 0px 5px 0px #848484;
          }
          .hamburger-btn{
            display: none;
          }
        }

        @media (max-width: 991px){
          .hamburger-btn{
            display: block;
            position: absolute;
            top:0;
            left:0;
          }
          .sidebar {
            display: none;
          }
          .fullWidthSidebar{
            position: fixed;
            z-index: -1;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            box-shadow: 2px 0px 5px 0px #848484;
          }
        }
      `}</style>
    </>
  );
};

export { Sidebar };
