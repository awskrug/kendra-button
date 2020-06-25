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
  'https://f9hg6qjmt8.execute-api.us-west-2.amazonaws.com/dev/graphql'; // dev
// const url = 'https://f9hg6qjmt8.execute-api.us-west-2.amazonaws.com/dev/noauth/graphql', // noauth

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

function MyApp({ Component, pageProps }: AppProps) {
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

MyApp.getInitialProps = async (props) => {
  const { ctx } = props || {};

  console.log('process.env.NODE_ENV', process.env.NODE_ENV)
  // solution: https://stackoverflow.com/a/60747333/8026431
  if (process.env.NODE_ENV === 'development') {
    const pathAndQueryDivided = ctx.req.url.split('?');
    console.log('pathAndQueryDivided:', pathAndQueryDivided)
    if (pathAndQueryDivided[0] !== '/' && pathAndQueryDivided[0].endsWith('/')) {
      const urlWithoutEndingSlash = pathAndQueryDivided[0].replace(/\/*$/gim, '');

      ctx.res.writeHead(301, {
        Location:
          urlWithoutEndingSlash +
          (pathAndQueryDivided.length > 1 ? `?${pathAndQueryDivided[1]}` : ''),
      });
      ctx.res.end();
      return {};
    }
  }

  return {};
};


export default MyApp;
