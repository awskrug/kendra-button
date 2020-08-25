/**
 * @reference https://nextjs.org/learn/excel/typescript/nextjs-types
 */
import * as React from 'react';

import { MainProvider, ModalProvider, Providers } from '../contexts';
import { PlainModal, SiteCreateModal } from '../components';

import { AppProps } from 'next/app';
import Layout from '../layout';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Providers contexts={[MainProvider, ModalProvider]}>
        <Layout>
          <PlainModal />
          <SiteCreateModal />
          <Component {...pageProps} />
        </Layout>
      </Providers>
    </>
  );
}

export default App;
