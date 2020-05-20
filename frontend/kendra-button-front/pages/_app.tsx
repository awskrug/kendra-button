/**
 * @reference https://nextjs.org/learn/excel/typescript/nextjs-types
 */

import { AppProps } from 'next/app'

function App({ Component, pageProps }: AppProps) {
  pageProps.custom = 'custom'
  pageProps.system = 'system'
  return <Component {...pageProps} />
}

export default App