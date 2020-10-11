import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api-graphql';

interface Props {
  query: string;
  variables?: object;
}
const callGraphql = async <T>({
  query,
  variables,
}: Props): Promise<GraphQLResult<T>> => {
  const res = await API.graphql({
    query,
    variables,
    // @ts-ignore
    authMode: 'AMAZON_COGNITO_USER_POOLS',
  });
  return res as GraphQLResult<T>;
};

export { callGraphql };
