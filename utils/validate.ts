export const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validateMobileNumber = (mobileNumber: string) => {
  return /^\d{10}$/.test(mobileNumber);
};

export const validatePassword = (password: string): boolean => {
  return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/.test(password);
};

export const validateAlphaNumeric = (input: string): boolean => {
  return /^[a-zA-Z0-9_ ]*$/.test(input);
};
