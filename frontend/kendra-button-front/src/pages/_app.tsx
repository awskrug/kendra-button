/**
 * @reference https://nextjs.org/learn/excel/typescript/nextjs-types
 */
import * as React from 'react';

import { MainProvider, ModalProvider, Providers } from '../contexts';

import Amplify from 'aws-amplify';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '../layout';
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);

/**
 * Using a non-AppSync GraphQL Server
 * @tutorial https://docs.amplify.aws/lib/graphqlapi/create-or-re-use-existing-backend/q/platform/js#using-a-non-appsync-graphql-server amplify
 */
Amplify.configure({
  API: {
    // graphql_endpoint: 'https://8pfums0mu7.execute-api.us-west-2.amazonaws.com/dev/graphql', // dev
    graphql_endpoint:
      'https://8pfums0mu7.execute-api.us-west-2.amazonaws.com/dev/noauth/graphql', // noauth
  },
});

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
