import { Loader } from './Loader';
import React from 'react';

interface Props {
  width?: string;
  height?: string;
  hide: boolean;
}

const PageLoader = (props: Props) => {
  const { width, height, hide = true } = props;
  if (hide) {
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
          width: ${width || '70vw'};
          margin-left: 30vw;
          height: ${height || '100vh'};
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

export { PageLoader };
