export interface CheckUserByLoginRepository {
  checkUserByLogin(login: string): Promise<boolean>;
}
