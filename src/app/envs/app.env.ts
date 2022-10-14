import 'dotenv/config';

export const appEnvironments = {
  NODE_ENV: process.env.NODE_ENV as string,
  REDIS_URL: process.env.REDIS_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIREIN: process.env.JWT_EXPIREIN as string,
  BCRYPT_SALT: parseInt(process.env.BCRYPT_SALT as string),
};
