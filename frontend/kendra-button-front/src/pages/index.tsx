import Link from 'next/link';

const Index = (props) => {
  return (
    <div className={`p-3`}>
      <h1>Kendra-Frontend</h1>
      <Link href='/admin'>
        <a className={`btn btn-primary`}>Go To Admin Page</a>
      </Link>
    </div>
  );
};

export default Index;
