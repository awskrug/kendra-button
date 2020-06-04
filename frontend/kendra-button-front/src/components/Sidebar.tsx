import { API, Auth, graphqlOperation } from 'aws-amplify';
import {
  Dispatch,
  MouseEventHandler,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import { Projects } from './Projects';
import { User } from '../types';
import { siteList } from '../graphql/queries'

interface Props {
  user: {
    attributes: User;
  };
  setIsLoggedIn?: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = (props: Props): ReactElement => {
  const { user, setIsLoggedIn } = props;

  const [loggedInUser, setLoggedInUser] = useState(user?.attributes?.email);
  const [isLoading, setIsLoading] = useState(true);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    setLoggedInUser(user?.attributes?.email);
    // call backend
    const callGraphql = async ({ qry }): Promise<GraphQLResult<any>> => {
      const res = await API.graphql(graphqlOperation(qry))
      return res as GraphQLResult<any>
    }
    callGraphql({ qry: siteList }).then(res => {
      setSites(res?.data?.sites)
      setIsLoading(false);
    }).catch(err => {
      
      setIsLoading(false);
    })
  }, [user]);

  const signOut: MouseEventHandler = async () => {
    await Auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <>
      <div
        className={`bg-primary d-flex flex-column justify-content-between align-items-stretch align-items-center p-3 sidebar`}
      >
        <div className={`d-flex flex-column`}>
          <div className={`btn-group my-3`}>
            <button type='button' className={`btn btn-danger`}>
              {loggedInUser}
            </button>
            <button
              type='button'
              className={`btn btn-outline-danger`}
              onClick={signOut}
            >
              <FontAwesomeIcon className={``} icon={faSignOutAlt} />
            </button>
          </div>
          <Projects list={sites} isLoading={isLoading} />
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
        }
      `}</style>
    </>
  );
};

export { Sidebar };
