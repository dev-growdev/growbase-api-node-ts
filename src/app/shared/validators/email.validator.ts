export const isValidEmail = (email: string): boolean => {
  const regex = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9._-]+@([a-zA-Z0-9._-]+\.)[a-zA-Z-0-9]{2,3}$/);
  return regex.test(email);
};
