export interface User {
  email: string;
  email_verified: boolean;
  phone_number: string;
  phone_number_verified: boolean;
  sub: string;
}

export interface Site {
  site: string;
  user: string;
  title: string;
  url: string;
}