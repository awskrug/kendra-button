import { CognitoUser } from '@aws-amplify/auth';

// related issue: https://github.com/aws-amplify/amplify-js/issues/4927
export interface User extends CognitoUser {
  attributes: {
    email: string;
    email_verified: boolean;
    phone_number: string;
    phone_number_verified: boolean;
    identities: string;
    sub: string;
  };
}

export interface CognitoException<T> {
  code: T;
  message: string;
  name: T;
}

export interface Site {
  site: string;
  user: string;
  domain: string;
  scrapEndpoint: string;
  term: string;
  crawlerStatus: {
    total: number;
    done: number;
  };
}
