import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { Auth } from 'aws-amplify';
import { AuthState } from '@aws-amplify/ui-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Projects } from './Projects';
import { User } from '../types';
import { ViewSource } from './ViewSource';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useMainContextImpls } from '../contexts';

interface Props {
  user: User;
  // setIsLoggedIn?: Dispatch<SetStateAction<boolean>>;
  setScreen: Dispatch<SetStateAction<any>>;
}

const Sidebar = (props: Props): ReactElement => {
  const { user, setScreen } = props;
  const { states, dispatch } = useMainContextImpls();
  const [displayAcc, setDisplayAcc] = useState<boolean>(false);

  useEffect(() => {
    if (states.loadingFlag) {
      setDisplayAcc(false);
    }
  }, [states.loadingFlag]);

  const sideBarClasses =
    'flex-column justify-content-between align-items-stretch align-items-center bg-primary sidebar';

  const signOut = async (): Promise<void> => {
    await Auth.signOut();
    setScreen(AuthState.SignIn);
  };

  const goToSettingsPage = (): void => {
    dispatch({
      type: 'change-content',
      payload: {
        content: 'settings',
      },
    });
    setDisplayAcc(false);
  };

  const toggleDisplay = (): void => {
    setDisplayAcc(!displayAcc);
  };

  return (
    <>
      <div
        className={`p-2 hamburger-btn m-1 shadow-sm rounded ${
          displayAcc ? `text-white bg-primary` : `text-dark bg-light`
        }`}
        onClick={toggleDisplay}
        role="button"
      >
        <FontAwesomeIcon icon={faBars} />
      </div>

      <div
        className={`sidebar bg-primary overflow-auto ${sideBarClasses} ${
          displayAcc ? `fullWidthSidebar` : ``
        }`}
      >
        <div className={`d-flex flex-column`}>
          <div className={`d-flex justify-content-center`}>
            <div className={`w-25`}></div>
            <div className={`w-50 text-center`}>
              <img
                className={`goddess`}
                src="/kendoll-E.png"
                style={{ height: '4rem' }}
              />
            </div>
            <ViewSource extraClass={`justify-content-end w-25`} />
          </div>
          <div className={`btn-group my-3`}>
            <button type="button" className={`btn btn-danger`}>
              {user?.attributes?.email}
            </button>
            <button
              type="button"
              className={`btn btn-outline-danger`}
              onClick={signOut}
            >
              <FontAwesomeIcon className={`mr-2`} icon={faSignOutAlt} />
              SIGN OUT
            </button>
          </div>
          {user && <Projects />}
        </div>
        <div>
          <div className={`d-flex flex-column`} onClick={goToSettingsPage}>
            <div className={`text-white btn btn-secondary`}>
              <FontAwesomeIcon className={`mr-2`} icon={faCog} />
              SETTINGS
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .goddess {
          animation: shining 5s infinite;
        }
        @keyframes shining {
          50% {
            filter: drop-shadow(0rem 0rem 2rem rgb(255 255 255));
          }
        }
        .hamburger-btn:focus,
        .hamburger-btn:active {
          background-color: ${displayAcc
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(0, 0, 0, 0.2)'};
        }
        .hamburger-btn:hover {
          background-color: ${displayAcc
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.05)'};
        }

        @media (min-width: 992px) {
          .sidebar {
            display: flex;
            padding: 1rem;
            position: fixed;
            z-index: 1;
            top: 0;
            left: 0;
            width: 30%;
            height: 100vh;
            box-shadow: 2px 0px 5px 0px #848484;
          }
          .hamburger-btn {
            display: none;
          }
        }

        @media (max-width: 991px) {
          .sidebar {
            display: none;
          }
          .hamburger-btn {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 110;
          }
          .fullWidthSidebar {
            display: flex;
            padding: 3rem 1rem 1rem;
            position: fixed;
            z-index: 100;
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
