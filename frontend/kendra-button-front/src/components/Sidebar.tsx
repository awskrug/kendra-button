import {
  Dispatch,
  MouseEventHandler,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { Auth } from 'aws-amplify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Projects } from './Projects';
import { User } from '../types';

interface Props {
  user: {
    attributes: User;
  };
  setIsLoggedIn?: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = (props: Props): ReactElement => {
  const { user, setIsLoggedIn } = props;

  const [loggedInUser, setLoggedInUser] = useState(user?.attributes?.email);

  useEffect(() => {
    console.log({ user });
    if (!user) return;
    setLoggedInUser(user?.attributes?.email);
  }, [user]);

  const signOut: MouseEventHandler = async () => {
    await Auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <>
      <div
        className={`bg-primary d-flex flex-column justify-content-between align-items-stretch align-items-center p-3 sidebar overflow-auto`}
      >
        <div className={`d-flex flex-column`}>
          <div className={`btn-group my-3`}>
            <button type="button" className={`btn btn-danger`}>
              {loggedInUser}
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
        <div className={`d-flex flex-column`}>
          <div className={`text-white btn btn-secondary`}>
            <FontAwesomeIcon className={`mr-2`} icon={faCog} />
            SETTINGS
          </div>
        </div>
      </div>
      <style jsx>{`
        .sidebar {
          position: fixed;
          z-index: 1;
          top: 0;
          left: 0;
          width: 30%;
          height: 100vh;
          box-shadow: 2px 0px 5px 0px #848484;
        }
      `}</style>
    </>
  );
};

export { Sidebar };
