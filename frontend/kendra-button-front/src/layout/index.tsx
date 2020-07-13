import Head from 'next/head';

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://bootswatch.com/4/sandstone/bootstrap.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Pacifico&display=swap"
          rel="stylesheet"
        ></link>
        {/*
          [Usage]
          font-family: 'Orbitron', sans-serif;
          font-family: 'Pacifico', cursive;
        */}
      </Head>
      {children}
    </>
  );
};

export default Layout;
