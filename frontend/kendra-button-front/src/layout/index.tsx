import {
  MainProvider,
  ModalProvider,
  Providers,
  useMainContextImpls,
} from '../contexts';

import { Head } from 'next/document';
import { useEffect } from 'react'

const Layout = ({ children }) => {
  const { states } = useMainContextImpls();

  return (
    <>
      {children}
    </>
  );
};

export default Layout;
