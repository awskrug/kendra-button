/**
 * @reference https://nextjs.org/learn/excel/typescript/nextjs-types
 */
import * as React from 'react';

import { MainProvider, ModalProvider, Providers } from '../contexts';
import { PlainModal, SiteCreateModal } from '../components';

// import NextApp, { AppProps } from 'next/app';
import { AppProps } from 'next/app';
import Layout from '../layout';

function App({ Component, pageProps }: AppProps) {
  console.log('pageProps', pageProps)
  return (
    <>
      <Providers contexts={[MainProvider, ModalProvider]}>
        <Layout>
          <PlainModal />
          <SiteCreateModal />
          <Component {...pageProps} custom={'custom'} system={'system'} />
        </Layout>
      </Providers>
    </>
  );
}

App.getInitialProps = async (props) => {

  const { Component, ctx } = props || {};
  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  return { pageProps };

}

export default App;