import { LoginFormType, SignUpFormType } from "@/types";

export function validatePassword(password: string) {
  if (password === "") return "Password is required!";
  else if (password.length < 6)
    return "Password must be at least 6 characters.";
  return undefined;
}

export function validateFormSignUp(user: SignUpFormType) {
  const { email = "", password = "", username = "" } = user;

  const errors: Partial<Record<keyof SignUpFormType, string>> = {};

  if (email === "") errors.email = "Email is required!";

  if (username === "") errors.username = "Username is required!";
  else if (username.length < 4)
    errors.username = "Username must be at least 4 characters.";
  else if (username.length > 32) errors.username = "Username is too long!";

  const errorPassword = validatePassword(password);
  if (errorPassword) errors.password = errorPassword;

  return errors;
}

export function validateFormLogin(params: LoginFormType) {
  const { email = "", password = "" } = params;

  const errors: Partial<Record<keyof LoginFormType, string>> = {};

  if (email === "") errors.email = "Email is required!";

  if (password === "") errors.password = "Password is required!";

  return errors;
}
