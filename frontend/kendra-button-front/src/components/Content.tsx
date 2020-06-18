import { PageLoader } from './PageLoader';
import { ReactElement } from 'react';
import { SiteMain } from './SiteMain';
import { useMainContextImpls } from '../contexts';

const Content = (): ReactElement => {
  const { states } = useMainContextImpls();

  if (!states.selectedSite) {
    return (
      <>
        <div
          className={`content d-flex justify-content-center align-items-center fa-lg`}
        >
          <div>Select Site</div>
        </div>
        <style jsx>{`
          .content {
            padding-left: 30%;
            width: 100vw;
            height: 100vh;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <PageLoader hide={states.loadingFlag} />
      <div className={`content`}>
        <SiteMain />
      </div>
      <style jsx>{`
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
      `}</style>
    </>
  );
};

export { Content };
