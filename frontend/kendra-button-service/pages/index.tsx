import Head from 'next/head';
import { Search } from '../components/Search';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface Props {}

export default function Home(props: Props) {
  const router = useRouter();
  const site = router.query.site as string;
  const domain = router.query.domain as string;
  const dev = router.query.dev as string;

  return (
    <div className="p-1">
      <Head>
        <title>Kendra-Button</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://bootswatch.com/4/sandstone/bootstrap.min.css"
        />
      </Head>

      <main>
        <Search site={site || 'site'} domain={domain} dev={dev} />
      </main>

      <footer></footer>

      <style jsx>{``}</style>
    </div>
  );
}
