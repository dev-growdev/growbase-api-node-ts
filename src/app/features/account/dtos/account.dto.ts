export interface AccountDTO {
  name: string;
  email: string;
  document: string;
  password: string;
  phone?: string;
}

export interface RecoveryPasswordDTO {
  link: string;
  password: string;
}

export interface CheckCodeDTO {
  code: string;
  email: string;
}
