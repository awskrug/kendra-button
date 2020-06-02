/**
 * @reference https://nextjs.org/learn/excel/typescript/nextjs-types
 */
import * as React from 'react';

import Amplify, { Auth } from 'aws-amplify';
import { MainProvider, ModalProvider, Providers } from '../contexts';

import { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '../layout';
import awsconfig from '../../aws-exports';
import { useMainContextImpls } from '../contexts';

Amplify.configure(awsconfig);

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel='stylesheet'
          href='https://bootswatch.com/4/sandstone/bootstrap.min.css'
        />
      </Head>
      <Providers contexts={[MainProvider, ModalProvider]}>
        <Layout>
          <Component {...pageProps} custom={'custom'} system={'system'} />
        </Layout>
      </Providers>
    </>
  );
}

export default App;
