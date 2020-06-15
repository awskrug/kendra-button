import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api-graphql';

interface Props {
  query: string;
  variables?: object;
}
const callGraphql = async ({
  query,
  variables,
}: Props): Promise<GraphQLResult<any>> => {
  const res = await API.graphql({
    query,
    variables,
    // @ts-ignore
    authMode: 'AMAZON_COGNITO_USER_POOLS',
  });
  return res as GraphQLResult<any>;
};

export { callGraphql };
