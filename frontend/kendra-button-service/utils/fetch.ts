import { getSearchQry, validationQry } from '../graphql';
interface Props {
  text: string;
  site: string;
  isValidation?: boolean;
  dev?: string;
}

const callGraphql = async ({
  text = '',
  site = '',
  isValidation,
  dev,
}: Props): Promise<any> => {
  const qry = isValidation
    ? validationQry({ site })
    : getSearchQry({
        text,
        site,
      });
  console.log('callGraphql', { isValidation, dev });
  console.log('qry:', qry);

  const reqUrl = dev
    ? 'https://dev.kendra-btns.whatilearened.today/noauth/graphql'
    : 'https://prod.kendra-btns.whatilearened.today/noauth/graphql';
  const res = await fetch(reqUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: qry }),
  });
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
