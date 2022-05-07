export interface Address {
  uid: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  postCode: string;
  state: string;
  latitude?: number;
  longitude?: number;
}
