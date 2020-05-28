/**
 * @reference https://nextjs.org/learn/excel/typescript/nextjs-types
 */

import Amplify, { Auth } from 'aws-amplify'

import { AppProps } from 'next/app'
import awsconfig from '../aws-exports'
import { withAuthenticator } from '@aws-amplify/ui-react'

Amplify.configure(awsconfig)

function App({ Component, pageProps }: AppProps) {
  // sample
  pageProps.custom = 'custom'
  pageProps.system = 'system'
  return <Component {...pageProps} />
}

export default withAuthenticator(App)