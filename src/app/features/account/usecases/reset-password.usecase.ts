import { BcryptAdapter } from '@shared/adapters';
import { RedisRepository } from '@shared/database/cache/redis.repository';
import { EmailData, GmailService } from '@shared/external';
import { LoadUserByLoginOrUidRepository } from '@shared/repositories';
import { ApplicationError, Result } from '@shared/utils';

export class ResetPassword {
  readonly #cache: RedisRepository;
  readonly #emailService: GmailService;
  readonly #encrypter: BcryptAdapter;
  readonly #loadUserByLoginOrUidRepository: LoadUserByLoginOrUidRepository;

  constructor(
    encrypter: BcryptAdapter,
    emailService: GmailService,
    cache: RedisRepository,
    loadUserByLoginOrUidRepository: LoadUserByLoginOrUidRepository,
  ) {
    this.#cache = cache;
    this.#emailService = emailService;
    this.#encrypter = encrypter;
    this.#loadUserByLoginOrUidRepository = loadUserByLoginOrUidRepository;
  }

  async execute(email: string): Promise<Result<void>> {
    const user = await this.#loadUserByLoginOrUidRepository.loadUser({ login: email });

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
