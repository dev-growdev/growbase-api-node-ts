import { AccountDTO } from '../../dtos';
import { User } from '../../models';

export interface CreateAccountRepository {
  createAccount(account: AccountDTO): Promise<User>;
}
