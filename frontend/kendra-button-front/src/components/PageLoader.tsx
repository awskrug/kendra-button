import { Loader } from './Loader';
import React from 'react';

interface Props {
  width?: string;
  height?: string;
  hide: boolean;
}

const PageLoader = (props: Props) => {
  const { width, height, hide = false } = props;

  if (!hide) {
    return null;
  }
  return (
    <>
      <div
        className={`d-flex align-items-center justify-content-center pageloader bg-dark fa-2x text-light`}
      >
        <Loader />
      </div>
      <style jsx>{`
        .pageloader {
          height: ${height || '100vh'};
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1040; /* refer to .modal-backdrop in bootswatch css */
          opacity: 0.5;
        }
        @media (min-width: 992px) {
          .pageloader {
            width: ${width || '70vw'};
            margin-left: 30vw;
          }
        }
        @media (max-width: 991px) {
          .pageloader {
            width: ${width || '100vw'};
            margin-left: 0;
          }
        }
      `}</style>
    </>
  );
};

export { PageLoader };
