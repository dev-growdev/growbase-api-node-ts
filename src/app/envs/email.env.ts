import 'dotenv/config';

export const emailEnvironments = {
  EMAIL_NAME: process.env.EMAIL_NAME as string,
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS as string,
  EMAIL_PASS: process.env.EMAIL_PASS as string,
};
