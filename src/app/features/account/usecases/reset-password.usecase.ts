import { AccountRepository } from '@account/repositories';
import { BcryptAdapter } from '@shared/adapters';
import { RedisRepository } from '@shared/database/cache/redis.repository';
import { EmailData, GmailService } from '@shared/external';
import { ApplicationError, Result } from '@shared/utils';

export class ResetPassword {
  readonly #cache: RedisRepository;
  readonly #emailService: GmailService;
  readonly #encrypter: BcryptAdapter;
  readonly #accountRepository: AccountRepository;

  constructor(
    encrypter: BcryptAdapter,
    emailService: GmailService,
    cache: RedisRepository,
    accountRepository: AccountRepository,
  ) {
    this.#cache = cache;
    this.#emailService = emailService;
    this.#encrypter = encrypter;
    this.#accountRepository = accountRepository;
  }

  async execute(email: string): Promise<Result<void>> {
    const user = await this.#accountRepository.loadUserByLogin(email);

    if (!user) {
      return Result.error(
        404,
        new ApplicationError('execute -> ResetPassword', 'Usuário não encontrado', []),
      );
    }

    const hash = await this.#encrypter.hash(user.userUid);
    const link = hash.replace(/\//g, '');

    const emailData: EmailData = {
      to: email,
      subject: 'Recuperação de senha',
      partial: 'reset-password-link',
      context: {
        link: `ADMIN_URL/reset-password/${link}`,
      },
    };

    await this.#emailService.sendMail(emailData);

    await this.#cache.saveEx(`account:reset-password:link:${link}`, user.userUid, 60 * 15);

    return Result.success();
  }
}
