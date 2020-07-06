import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loader = ({ className = '' }) => {
  return (
    <>
      <FontAwesomeIcon icon={faSpinner} className={className} pulse />
    </>
  );
};

export { Loader };
