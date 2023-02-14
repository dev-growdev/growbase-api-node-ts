import { RedisRepository } from '@shared/database/cache/redis.repository';
import { GmailService, EmailData } from '@shared/external';
import { Result } from '@shared/utils';

export class ActiveAccount {
  readonly #emailService: GmailService;
  readonly #cache: RedisRepository;

  constructor(emailService: GmailService, cache: RedisRepository) {
    this.#emailService = emailService;
    this.#cache = cache;
  }

  async execute(email: string, userUid: string): Promise<Result<void>> {
    const code = this.createActivationCode();

    const emailData: EmailData = {
      to: email,
      partial: 'activation-account',
      subject: 'Ativação de conta',
      context: {
        code,
      },
    };

    await this.#cache.saveEx(`account:activation:${email}:code:${code}`, userUid, 7200);

    await this.#emailService.sendMail(emailData);

    return Result.success();
  }

  private createActivationCode = (): string => {
    let code = '';

    for (let i = 0; i <= 5; i++) {
      const number = (Math.random() * 9).toFixed();
      code += number === '10' ? '0' : number;
    }

    return code;
  };
}
