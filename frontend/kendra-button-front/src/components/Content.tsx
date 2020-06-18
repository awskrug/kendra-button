import { useMainContextImpls, useModalContextImpls } from '../contexts';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PageLoader } from './PageLoader';
import { ProgressBar } from './ProgressBar';
import { ReactElement } from 'react';
import { SiteMain } from './SiteMain';
import { TitleEdit } from './TitleEdit';
import { faCode } from '@fortawesome/free-solid-svg-icons';

// import { callGraphql } from '../utils';

const Content = (): ReactElement => {
  const { states } = useMainContextImpls();
  const { setModalConfig } = useModalContextImpls();
  const { title, url, term, crawlerStatus } = states.selectedSite || {};
  const { total, done } = crawlerStatus || {};

  const askToDelete = (): void => {
    setModalConfig({
      type: 'plain',
      display: true,
      title: 'Are you sure?',
      content: `Are you really going to delete this site "${title}"?`,
      okaction: async ({ hideModal }) => {
        // TODO: call graphql that exec DELETE
        // callGraphql({ query: })
        console.log('delete!');
      },
    });
  };

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
