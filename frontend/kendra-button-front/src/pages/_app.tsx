/**
 * @reference https://nextjs.org/learn/excel/typescript/nextjs-types
 */
import * as React from 'react';

import { MainProvider, ModalProvider, Providers } from '../contexts';
import { PlainModal, SiteCreateModal } from '../components';

import NextApp, { AppProps } from 'next/app';
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

  // const { Component, ctx } = props || {};
  const { ctx } = props || {};
  if (!ctx.req) return {}
  console.log('ctx', ctx.req.url)
  const appProps = await NextApp.getInitialProps(props);


  // console.log(Component)
  // console.log('process.env.NODE_ENV', process.env.NODE_ENV)
  // solution: https://stackoverflow.com/a/60747333/8026431

  // if (process.env.NODE_ENV === 'development') {

  //   if (!ctx.req) return {}

  //   const pathAndQueryDivided = ctx.req.url.split('?');
  //   console.log('pathAndQueryDivided:', pathAndQueryDivided)
  //   if (pathAndQueryDivided[0] !== '/' && pathAndQueryDivided[0].endsWith('/')) {
  //     const urlWithoutEndingSlash = pathAndQueryDivided[0].replace(/\/*$/gim, '');

  //     console.log('pathAndQueryDivided:', pathAndQueryDivided)
  //     console.log('urlWithoutEndingSlash:', urlWithoutEndingSlash)

  //     const location = urlWithoutEndingSlash +
  //       (pathAndQueryDivided.length > 1 ? `?${pathAndQueryDivided[1]}` : '')

  //     console.log('location:', location)

  //     ctx.res.writeHead(301, {
  //       Location: urlWithoutEndingSlash +
  //         (pathAndQueryDivided.length > 1 ? `?${pathAndQueryDivided[1]}` : ''),
  //     });
  //     ctx.res.end();
  //     return { "error": "Invalid Facebook account. \nPlease check the email address on your Facebook account." };
  //   }
  // }

  return { ...appProps };

}

export default App;