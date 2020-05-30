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
  console.log('Layout is', states)
  useEffect(() => {
    var newLink = document.createElement('link');
    newLink.rel='stylesheet'
    newLink.href=`https://bootswatch.com/4/${states.theme}/bootstrap.min.css`
    const bootswatch = document.querySelector('head > link[href*="bootswatch"]')
    bootswatch.replaceWith(newLink)
  }, [states.theme])

  return (
    <>
      {children}
    </>
  );
};

export default Layout;
