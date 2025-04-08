const validateUsername = (username: string) => {
  return username.length >= 4;
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regular expression used to validate emails
  return emailRegex.test(email); // test method checks if the email string matches the pattern
};

const validatePassword = (password: string) => {
  return password.length >= 6;
};

export { validateUsername, validateEmail, validatePassword };
