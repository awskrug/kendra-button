import Head from 'next/head';

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://bootswatch.com/4/sandstone/bootstrap.min.css"
        />
        {/*
          [Usage]
          font-family: 'Orbitron', sans-serif;
          font-family: 'Pacifico', cursive;
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Pacifico&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon-16.png" sizes="16x16" />
        <link rel="icon" href="/favicon-32.png" sizes="32x32" />
        <link rel="icon" href="/favicon-48.png" sizes="48x48" />
        <link rel="icon" href="/favicon-64.png" sizes="64x64" />
        <link rel="icon" href="/favicon-128.png" sizes="128x128" />
        <title>KENDRA BUTTON</title>
      </Head>
      {children}
    </>
  );
};

export default Layout;
