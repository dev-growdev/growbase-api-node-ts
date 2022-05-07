export interface AddressDTO {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  postCode: string;
  state: string;
  complement?: string;
  latitude?: number;
  longitude?: number;
}
