/**
 * @reference https://nextjs.org/learn/excel/typescript/nextjs-types
 */
import * as React from 'react';

import Amplify, { Auth } from 'aws-amplify';
import { MainProvider, ModalProvider, Providers } from '../contexts';
import { PlainModal, SiteCreateModal } from '../components';

import { AppProps } from 'next/app';
import Layout from '../layout';
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);

const url =
  'https://8pfums0mu7.execute-api.us-west-2.amazonaws.com/dev/graphql'; // dev
// const url = 'https://8pfums0mu7.execute-api.us-west-2.amazonaws.com/dev/noauth/graphql', // noauth

/**
 * Using a non-AppSync GraphQL Server
 * @tutorial https://docs.amplify.aws/lib/graphqlapi/create-or-re-use-existing-backend/q/platform/js#using-a-non-appsync-graphql-server amplify
 */
Amplify.configure({
  API: {
    graphql_endpoint: url,
    graphql_headers: async () => ({
      Authorization: (await Auth.currentSession()).getIdToken().getJwtToken(),
    }),
  },
});

function App({ Component, pageProps }: AppProps) {
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

export default App;
