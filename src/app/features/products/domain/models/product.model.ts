import { ServiceProvider } from './';

export interface Product {
  uid: string;
  name: string;
  type: string;
  description?: string;
  price?: number;
  serviceProvider: ServiceProvider;
}
