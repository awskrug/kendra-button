import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loader = () => {
  return (
    <>
      <FontAwesomeIcon icon={faSpinner} pulse />
    </>
  );
};

export { Loader };
