import { getSearchQry, validationQry } from '../graphql';
interface Props {
  text: string;
  site: string;
  isValidation?: boolean;
  dev?: string;
}
interface GraphQLResult<T = object> {
  data?: T;
  errors?: [
    {
      locations: object;
      message: string;
      path: object;
    },
  ];
  extensions?: {
    [key: string]: any;
  };
}

interface fetchResult {
  status: number;
  message?: string;
  data?: any;
}

const callGraphql = async ({
  text = '',
  site = '',
  isValidation,
  dev,
}: Props): Promise<fetchResult> => {
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
  const res: Response = await fetch(reqUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: qry }),
  });
  const resJson: GraphQLResult<any> = await res.json();

  if (resJson.errors && resJson.errors.length > 0) {
    const error = resJson.errors[0].message;
    return {
      status: 400,
      message: error,
    };
  }
  return {
    status: 200,
    data: resJson.data,
  };
};

export { callGraphql };
