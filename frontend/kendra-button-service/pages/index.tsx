import Head from 'next/head';
import { Search } from '../components/Search';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    let localStorage = JSON.parse(
      window.localStorage.getItem('ally-supports-cache'),
    );
    console.log({ localStorage });
  }, []);
  return (
    <div className="">
      <Head>
        <title>Kendra-Button</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://bootswatch.com/4/sandstone/bootstrap.min.css"
        />
      </Head>

      <main>
        <Search site={'site'} />
      </main>

      <footer></footer>

      <style jsx>{``}</style>
    </div>
  );
}
