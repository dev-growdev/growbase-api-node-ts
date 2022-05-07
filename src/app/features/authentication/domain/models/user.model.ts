import { ServiceProvider } from '.';

export interface AuthUser {
  login: string;
  verified: boolean;
  enable: boolean;
  password?: string;
}

export interface User {
  uid: string;
  uidProfile: string;
  name: string;
  email: string;
  document: string;
  serviceProviders: ServiceProvider[];
  auth?: AuthUser;
}
