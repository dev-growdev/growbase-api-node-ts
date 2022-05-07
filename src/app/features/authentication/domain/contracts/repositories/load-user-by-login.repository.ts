import { User } from '../../models';

export interface LoadUserByLoginRepository {
  loadUserByLogin(login: string): Promise<User | undefined>;
}
