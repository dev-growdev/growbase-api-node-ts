declare namespace Express {
  interface Request {
    authUser: {
      userUid: string;
      profileUid: string;
    };
  }
}
