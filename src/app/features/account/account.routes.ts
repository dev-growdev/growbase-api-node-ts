import { AuthMiddleware } from '@shared/middlewares';
import express from 'express';
import {
  ResetPasswordController,
  SignUpController,
  VerifyAccountController,
  RecoveryPasswordController,
  UpdatePasswordController,
} from './controllers';
import { UpdateProfileController } from './controllers/update-profile.controller';
import {
  ResetPasswordValidator,
  SignUpValidator,
  VerifyAccountValidator,
  RecoveryPasswordValidator,
  UpdatePasswordValidator,
  UpdateProfileValidator,
} from './validators';

export default (router: express.Router): void => {
  const auth = new AuthMiddleware();

  router.post('/signup', new SignUpValidator().handle, new SignUpController().signUp);
  router.post(
    '/verify-account',
    new VerifyAccountValidator().handle,
    new VerifyAccountController().verifyAccount,
  );
  router.post(
    '/account/reset-password',
    new ResetPasswordValidator().handle,
    new ResetPasswordController().resetPassword,
  );
  router.put(
    '/account/recovery-password',
    new RecoveryPasswordValidator().handle,
    new RecoveryPasswordController().recoveryPassword,
  );
  router.put(
    '/account/update-password',
    auth.handle,
    new UpdatePasswordValidator().handle,
    new UpdatePasswordController().updatePassword,
  );
  router.put(
    '/account/profile',
    auth.handle,
    new UpdateProfileValidator().handle,
    new UpdateProfileController().updateProfile,
  );
};
