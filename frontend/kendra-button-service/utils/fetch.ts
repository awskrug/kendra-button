import { getSearchQry } from '../graphql';
interface Props {
  text: string;
  site: string;
}

const callGraphql = async ({ text = '', site = '' }: Props): Promise<any> => {
  const qry = getSearchQry({
    text,
    site,
  });
  console.log('qry:', qry);
  const res = await fetch(
    'https://dev.kendra-btns.whatilearened.today/noauth/graphql',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: qry }),
    }
  );
  const data = await res.json();

  if (data.errors && data.errors.length > 0) {
    const error = data.errors[0].message;
    return {
      status: 400,
      message: error,
    };
  }
  return {
    status: 200,
    data,
  };
};

export { callGraphql };
