import { Dispatch, ReactElement, SetStateAction } from 'react';

import { PageLoader } from './PageLoader';
import { Settings } from './Settings';
import { SiteMain } from './SiteMain';
import { User } from '../types';
import { useMainContextImpls } from '../contexts';

interface Props {
  user: User;
  setIsLoggedIn?: Dispatch<SetStateAction<boolean>>;
}

const Content = (props: Props): ReactElement => {
  const { states } = useMainContextImpls();
  const { user, setIsLoggedIn } = props;
  const { selectedSite, loadingFlag, content } = states;

  return (
    <>
      <PageLoader hide={loadingFlag} />
      <div className={`content`}>
        {!content ? (
          <div
            className={`h-100 d-flex justify-content-center align-items-center fa-lg`}
          >
            <div>Select Site</div>
          </div>
        ) : content === 'site' ? (
          <SiteMain user={user} siteInfo={selectedSite} />
        ) : content === 'settings' ? (
          <Settings user={user} setIsLoggedIn={setIsLoggedIn} />
        ) : null}
      </div>
      <style jsx>{`
        @media (min-width: 992px) {
          .content {
            padding-left: 30%;
            width: 100vw;
            height: 100vh;
          }
          .pageloader {
            width: 70vw;
            margin-left: 30vw;
            height: 100vh;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1040; /* refer to .modal-backdrop in bootswatch css */
            opacity: 0.5;
          }
        }
        @media (max-width: 991px) {
          .content {
            width: 100vw;
            height: 100vh;
            padding-top: 3rem;
          }
          .pageloader {
            width: 100vw;
            height: 100vh;
            z-index: 1040; /* refer to .modal-backdrop in bootswatch css */
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  );
};

export { Content };
